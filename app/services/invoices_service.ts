import { Invoice, InvoiceRequestBody } from "../../types/Invoice.types";
import { StockState } from "../../types/State.types";
import { db } from "../database/db";
import { get_nonzero_stock_states_by_item_id_service } from "./states_service";

export const insert_invoice_service = async (invoice: Invoice) => {
  console.log(`Inserting invoice...`)
  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.invoices(
                    invoice_date, paid_price, user_id, payment_method_id, 
                    gifted_amount, invoice_price, invoice_cost) 
                    VALUES ($<invoice_date>, $<paid_price>, $<user_id>, 
                    $<payment_method_id>, $<gifted_amount>, $<invoice_price>, 
                    $<invoice_cost>) RETURNING invoice_id`;
    const resp = await db.one(query, invoice)
    console.log(`Passed: invoice inserted`)
    return resp;

  } catch (error) {
    console.log(`Failed: inserting invoice ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_invoice_and_items_service = async (model: InvoiceRequestBody) => {
  console.log(`Adding invoice and items`)
  try {
    // insert invoice
    const resp = await insert_invoice_service({
      invoice_cost: model.invoice_cost,
      invoice_date: model.invoice_date,
      invoice_price: model.invoice_price,
      paid_price: model.paid_price,
      user_id: model.user_id,
      gifted_amount: model.gifted_amount,
      payment_method_id: model.payment_method_id
    })

    if (resp?.invoice_id) {
      model.items.forEach(async (item) => {
        // step 1: add invoice item
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.invoice_items(
                        invoice_id, item_id, is_unit, quantity, total_price, 
                        total_cost, cost, price) 
                        VALUES ($<invoice_id>, $<item_id>, $<is_unit>, 
                        $<quantity>, $<total_price>, $<total_cost>,
                        $<cost>, $<price>) 
                        RETURNING invoice_item_id`;
        try {
          const invoiceItemResp = await db.one(query, { invoice_id: resp?.invoice_id, ...item })
          console.log(`Passed: invoice item ${invoiceItemResp?.invoice_item_id} added `)
        } catch (err) {
          console.log(`Failed: failed adding invoice item ==> ${err}`);
          return ({ error: `DB error` });
        }
        // step 2: update item state
        try {
          const itemState = await db.one(`SELECT total_available_units, total_available_pcs 
                                            FROM ${process.env.DB_SCHEMA}.items_state 
                                            WHERE item_id = $<item_id> 
                                            `, { item_id: item.item_id })

          // tau: total available units, tap: total available pcs
          let tau, tap;

          if (itemState && item.is_unit) {
            tau = itemState?.total_available_units - item.quantity
            tap = itemState?.total_available_pcs - (item.quantity * item.pcs_per_unit)
          } else if (itemState && !item.is_unit) {
            tap = itemState?.total_available_pcs - item.quantity
            // tau = Number(Math.floor(tap / item.pcs_per_unit) + '.' + (tap % item.pcs_per_unit))
            tau = tap / item.pcs_per_unit
          }

          if (itemState) {
            try {
              await db.none(`UPDATE ${process.env.DB_SCHEMA}.items_state 
                  SET total_available_units=$<tau>, 
                  total_available_pcs = $<tap> 
                  WHERE item_id = $<item_id>`, {
                item_id: item.item_id,
                tau: tau,
                tap: tap
              })

              console.log(`Passed: item state successfully updated`)

            } catch (err) {
              console.log(`Failed: updating item state for item ${item.item_id} ==> ${err}`);
              return ({ error: `DB error` });
            }
          }

        } catch (error) {
          console.log(`Failed: adding invoice item ==> ${error}`);
          return ({ error: `DB error` });
        }

        // step 3: update stock state
        try {
          const stockStatesRes = await get_nonzero_stock_states_by_item_id_service(item.item_id)

          let stopFlag = false;
          let index = 0;

          if (Array.isArray(stockStatesRes) && item.is_unit) {
            let newQuantity = 0;
            while (!stopFlag && (index < stockStatesRes.length)) {
              const state: StockState = stockStatesRes[index]
              let diff = 0
              if (index == 0)
                diff = state.current_units - item.quantity
              else
                diff = state.current_units + newQuantity
              if (diff >= 0.0) {
                const units = diff
                const pcs = state.current_pcs - ((index == 0 ? item.quantity : (newQuantity * (-1))) * item.pcs_per_unit)

                const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = $<units>, current_pcs = $<pcs> 
                    WHERE state_id = $<state_id> RETURNING stocking_id`

                try {
                  const updateStateResp = await db.one(updateStateQuery, {
                    units, pcs, state_id: state.state_id
                  })
                  console.log(`Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`)

                } catch (error) {
                  console.log(`Failed: updating stock state for 
                    item ${item.item_id} and state id ${state.state_id} ==> ${error}`);
                  return ({ error: `DB error` });
                }
                stopFlag = true
              } else {
                index = index + 1;
                const units = 0
                const pcs = 0
                const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = $<units>, current_pcs = $<pcs> 
                    WHERE state_id = $<state_id> RETURNING stocking_id`
                try {
                  const updateStateResp = await db.one(updateStateQuery, {
                    units, pcs, state_id: state.state_id
                  })
                  console.log(`Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`)
                  newQuantity = diff
                } catch (error) {
                  console.log(`Failed: updating stock state for 
                    item ${item.item_id} and state id ${state.state_id} ==> ${error}`);
                  return ({ error: `DB error` });
                }
              }
            }
          } else if (Array.isArray(stockStatesRes) && !item.is_unit) {
            let newQuantity = 0;
            while (!stopFlag && (index < stockStatesRes.length)) {
              const state: StockState = stockStatesRes[index]

              let diff = 0
              if (index == 0)
                diff = state.current_pcs - item.quantity
              else
                diff = state.current_pcs + newQuantity

              if (diff >= 0.0) {
                const pcs = diff
                // const units = Number(Math.floor(pcs / item.pcs_per_unit) + '.' + (pcs % item.pcs_per_unit))
                const units = pcs / item.pcs_per_unit

                const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = $<units>, current_pcs = $<pcs> 
                    WHERE state_id = $<state_id> RETURNING stocking_id`

                try {
                  const updateStateResp = await db.one(updateStateQuery, {
                    units, pcs, state_id: state.state_id
                  })
                  console.log(`Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`)

                } catch (error) {
                  console.log(`Failed: updating stock state for 
                    item ${item.item_id} and state id ${state.state_id} ==> ${error}`);
                  return ({ error: `DB error` });
                }
                stopFlag = true
              } else {
                index = index + 1;
                const units = 0
                const pcs = 0
                const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = $<units>, current_pcs = $<pcs> 
                    WHERE state_id = $<state_id> RETURNING stocking_id`
                try {
                  const updateStateResp = await db.one(updateStateQuery, {
                    units, pcs, state_id: state.state_id
                  })
                  console.log(`Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`)
                  newQuantity = diff
                } catch (error) {
                  console.log(`Failed: updating stock state for 
                    item ${item.item_id} and state id ${state.state_id} ==> ${error}`);
                  return ({ error: `DB error` });
                }
              }
            }
          }
        } catch (error) {
          console.log(`Failed: adding invoice item ==> ${error}`);
          return ({ error: `DB error` });
        }
      });
      console.log(`Passed: invoice and invoice items have been added.`)
    }

    return resp
  } catch (error) {
    console.log(`Failed: adding invoice ==> ${error}`);
    return ({ error: `DB error` });
  }
}
