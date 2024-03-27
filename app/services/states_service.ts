import { StockState } from '../../types/State.types';
import { db } from '../database/db';

export const get_stocks_states_service = async () => {
  console.log(`Looking all stocks states...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.stocks_state`);
    console.log(`Passed: all stocks states found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks states ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_stock_state_service = async (model: Omit<StockState, 'state_id'>) => {
  console.log(`Creating new stock state for item id ${model.item_id}`)

  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.stocks_state(item_id, stocking_id, current_units, current_pcs, pcs_per_unit, solid_units, solid_pcs, total_cost, total_price, approx_profit, gifted_units, gifted_pcs, damaged_units, damaged_pcs, expired_units, expired_pcs, returned_units_to_supplier, returned_pcs_to_supplier)
      VALUES ( $<item_id>, $<stocking_id>, $<current_units>, $<current_pcs>, $<pcs_per_unit>, $<solid_units>, $<solid_pcs>, $<total_cost>, $<total_price>, $<approx_profit>, $<gifted_units>, $<gifted_pcs>, $<damaged_units>, $<damaged_pcs>, $<expired_units>, $<expired_pcs>, $<returned_units_to_supplier>, $<returned_pcs_to_supplier>)
      RETURNING state_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: new stock state created for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating stock state ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const delete_stock_state_service = async (state_id: number) => {
  console.log(`Creating new stock state of id ${state_id}`)

  try {
    const query = `DELETE FROM ${process.env.DB_SCHEMA}.stocks_state WHERE state_id = $<state_id>`;
    const respond = await db.one(query, {state_id});
    console.log(`Passed: stock state of id ${state_id} deleted`)
    return respond;
  } catch (error) {
    console.log(`Failed: deleting stock state ==> ${error}`);
    return ({ error: `DB error` });
  }
}
