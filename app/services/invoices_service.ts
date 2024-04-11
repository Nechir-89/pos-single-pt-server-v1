import { Invoice, InvoiceRequestBody } from "../../types/Invoice.types";
import { db } from "../database/db";

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
          } else if(itemState && !item.is_unit){
            tap = itemState?.total_available_pcs - item.quantity
            tau = Number(Math.floor(tap / item.pcs_per_unit) + '.' + (tap % item.pcs_per_unit))
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
      });
      console.log(`Passed: invoice and invoice items have been added.`)
    }
    return resp
  } catch (error) {
    console.log(`Failed: adding invoice ==> ${error}`);
    return ({ error: `DB error` });
  }
}