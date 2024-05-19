import { Stock } from '../../types/Stock.types';
import { db } from '../database/db';

export const get_stocks_service = async () => {
  console.log(`Looking all stocks...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.stocking`);
    console.log(`Passed: all stocks found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_stock_service = async (model: Omit<Stock, 'stocking_id'>) => {
  console.log(`Creating new stock for item id ${model.item_id}`)

  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.stocking(
      unit_cost, unit_price, pc_cost, pc_price, amount_in_units, expire_date, user_id, item_id, stocking_note, production_date, barcode, pc_barcode)
      VALUES ( $<unit_cost>, $<unit_price>, $<pc_cost>, $<pc_price>, $<amount_in_units>, $<expire_date>, $<user_id>, $<item_id>, $<stocking_note>, $<production_date>, $<barcode>, $<pc_barcode>) 
      RETURNING stocking_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: stock created for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating stock ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const delete_stock_service = async (stocking_id: number) => {
  console.log(`Deleting stock with stocking id ${stocking_id}`)

  try {
    const query = `DELETE FROM ${process.env.DB_SCHEMA}.stocking WHERE stocking_id=$<stocking_id>`;
    const respond = await db.none(query, { stocking_id });
    console.log(`Passed: deleting stock with stocking id ${stocking_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: deleting stock with stocking id ${stocking_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_stock_expire_date_service = async (stocking_id: number, expire_date: string) => {
  console.log(`Updating stock expire date for stocking id ${stocking_id}`)

  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.stocking 
                    SET expire_date = $<expire_date> 
                    WHERE stocking_id = $<stocking_id> 
                    RETURNING stocking_id`;
    const respond = await db.one(query, { stocking_id, expire_date });
    console.log(`Passed: stock expire date updated`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating stock expire date ==> ${error}`);
    return ({ error: `DB error` });
  }
}
