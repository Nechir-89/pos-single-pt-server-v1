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