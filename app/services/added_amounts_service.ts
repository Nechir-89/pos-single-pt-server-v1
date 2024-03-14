import { AddedAmount } from '../../types/added_amounts.types';
import { db } from '../database/db';

export const get_all_added_amounts_service = async () => {
  console.log(`Getting all added amounts`);
  try {
    const query = `SELECT * FROM added_amounts`;
    const addedAmounts: AddedAmount[] = await db.any(query);
    return addedAmounts;
  } catch (error) {
    console.log(`failed getting added amounts because ==> ${error}`);
    return ({ error: `DB error` });
  }
}
// added amounts belong to a warehouse
export const get_warehouse_added_amounts_service = async (warehouseId: number) => {
  console.log(`Getting added amounts for warehouse ${warehouseId}`);
  try {
    const query = `SELECT * FROM added_amounts WHERE warehouse_id=$<warehouseId>`;
    const addedAmounts: AddedAmount[] = await db.any(query, { warehouseId });
    return addedAmounts;
  } catch (error) {
    console.log(`failed getting added amounts because ==> ${error}`);
    return ({ error: `DB error` });
  }
}

// added amounts belong to an item
export const get_item_added_amounts_service = async (itemId: number) => {
  console.log(`Getting added amounts for item ${itemId}`);
  try {
    const query = `SELECT * FROM added_amounts WHERE item_id=$<itemId>`;
    const addedAmounts: AddedAmount[] = await db.any(query, { itemId });
    return addedAmounts;
  } catch (error) {
    console.log(`failed getting added amounts because ==> ${error}`);
    return ({ error: `DB error` });
  }
}

// single added amount record
export const get_added_amount_service = async (id: number) => {
  console.log(`Getting added amount for id ${id}`);
  try {
    const query = `SELECT * FROM added_amounts WHERE id=$<id>`;
    const addedAmount: AddedAmount | null = await db.oneOrNone(query, { id });
    return addedAmount;
  } catch (error) {
    console.log(`failed getting added amount because ==> ${error}`);
    return ({ error: `DB error` });
  }
}

// all documents from all warehouses
export const get_all_documents_service = async () => {
  console.log(`Getting all documents`);
  try {
    const query = `SELECT items.name, items.barcode, items.cates_id, cates.name as cates_name, cates.unit_type, cadded_amounts.* 
                    FROM added_amounts, items, cates 
                    WHERE added_amounts.item_id = items.id and items.cates_id = cates.id`;
    const documents = await db.any(query);
    return documents;
  } catch (error) {
    console.log(`failed getting added amount because ==> ${error}`);
    return ({ error: `DB error` });
  }
}

// warehouse documents
export const get_warehouse_documents_service = async (warehouseId: number) => {
  console.log(`Getting documents for warehouse ${warehouseId}`);
  try {
    const query = `SELECT items.name, items.barcode, items.cates_id, items.current, items.added, cates.name as cates_name, cates.unit_type, added_amounts.* 
                    FROM added_amounts, items, cates 
                    WHERE added_amounts.item_id = items.id and items.cates_id = cates.id and added_amounts.warehouse_id = $<warehouseId>`;
    const documents = await db.any(query, { warehouseId });
    return documents;
  } catch (error) {
    console.log(`failed getting added amount because ==> ${error}`);
    return ({ error: `DB error` });
  }
}
// warehouse item documents
export const get_warehouse_item_documents_service = async (warehouseId: number, itemId: number) => {
  console.log(`Getting documents for warehouse ${warehouseId} and item ${itemId}`);
  try {
    const query = `SELECT items.name, items.barcode, items.cates_id, cates.name as cates_name, cates.unit_type, added_amounts.* 
                    FROM added_amounts, items, cates 
                    WHERE added_amounts.item_id = $<itemId> and items.id = $<itemId> and items.cates_id = cates.id and added_amounts.warehouse_id = $<warehouseId>`;
    const documents = await db.any(query, { warehouseId, itemId });
    return documents;
  } catch (error) {
    console.log(`failed getting added amount because ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_amount_service = async (model: Omit<AddedAmount, "id">) => {
  console.log(`Adding new item amount for item ${model.item_id} in warehouse ${model.warehouse_id} ==> ${model.date}`);
  // console.log(model)
  try {
    const q2 = `UPDATE items SET current = (SELECT current FROM items WHERE id = $<item_id>) + $<amount>, 
                added = (SELECT added FROM items WHERE id = $<item_id>) + $<amount> 
                WHERE id = $<item_id>`;
    await db.any(q2, { ...model });
    
    const query = `INSERT INTO added_amounts(item_id, amount, price, "user", note, date, warehouse_id) 
                    VALUES ($<item_id>, $<amount>, $<price>, $<user>, $<note>, $<date>, $<warehouse_id>);`;
    const respond = await db.none(query, { ...model });

    console.log(`Amount added to item ${model.item_id}`);
    console.log()
    return respond;
  } catch (error) {
    console.log(`failed adding new amount ${error}`);
    return ({ error: `DB error` });
  }
}

export const remove_amount_service = async (model: AddedAmount) => {
  console.log(`Removing amount for item ${model.item_id} in warehouse ${model.warehouse_id} ==> ${model.date}`);
  // console.log(model)
  try {
    const q2 = `UPDATE items SET current = (SELECT current FROM items WHERE id = $<item_id>) - $<amount>, 
                added = (SELECT added FROM items WHERE id = $<item_id>) - $<amount> 
                WHERE id = $<item_id>`;
    await db.any(q2, { ...model });
    
    const query = `DELETE FROM added_amounts WHERE id=$<id>`;
    const respond = await db.none(query, { ...model });

    console.log(`Amount removed from item ${model.item_id}`);
    console.log()
    return respond;
  } catch (error) {
    console.log(`failed removing amount ${error}`);
    return ({ error: `DB error` });
  }
}