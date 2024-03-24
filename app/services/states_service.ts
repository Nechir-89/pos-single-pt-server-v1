import { State } from '../../types/State.types';
import { db } from '../database/db';

export const get_items_states_service = async () => {
  console.log(`Looking all items states...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.items_state`);
    console.log(`Passed: all items states found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking items states ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_item_state_service = async (model: Omit<State, 'state_id'>) => {
  console.log(`Creating new item state for item id ${model.item_id}`)

  try {
    const query = `INSERT INTO pos_single_pt_schema.items_state(item_id, stocking_id, current_units, current_pcs, pcs_per_unit, solid_units, solid_pcs, total_cost, total_price, approx_profit, gifted_units, gifted_pcs, damaged_units, damaged_pcs, expired_units, expired_pcs, returned_units_to_supplier, returned_pcs_to_supplier)
      VALUES ( $<item_id>, $<stocking_id>, $<current_units>, $<current_pcs>, $<pcs_per_unit>, $<solid_units>, $<solid_pcs>, $<total_cost>, $<total_price>, $<approx_profit>, $<gifted_units>, $<gifted_pcs>, $<damaged_units>, $<damaged_pcs>, $<expired_units>, $<expired_pcs>, $<returned_units_to_supplier>, $<returned_pcs_to_supplier>)
      RETURNING state_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: new item state created for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating item state ==> ${error}`);
    return ({ error: `DB error` });
  }
}
