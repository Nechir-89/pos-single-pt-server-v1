import { Borrow } from "../../types/borrow.types";
import { db } from "../database/db";

export const get_borrows_service = async () => {
  console.log(`Getting all borrows`);
  try {
    const respond: Borrow[] = await db.any(`SELECT * FROM borrow`);
    return respond;
  } catch (error) {
    console.log(`failed getting borrows ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_borrow_service = async (id: number) => {
  console.log(`Getting borrow ${id}`)
  try {
    const query = `SELECT * FROM borrow WHERE id = $<id>`;
    const borrow: Borrow | null = await db.oneOrNone(query, { id });
    return borrow;
  } catch (error) {
    console.log(`failed getting borrow ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_borrow_service = async (model: Omit<Borrow, "id">) => {
  console.log(`Add new borrow for: ${model.employee_id}`);
  try {
    const query = `INSERT INTO borrow (employee_id,item_id,amount,date,note,username,barcode, changed)
                    VALUES ($<employee_id>,$<item_id>,$<amount>,$<date>,$<note>,$<username>,$<barcode>,$<changed>)`;

    const q2 = `
    UPDATE items
    SET inuse = $<amount> + (SELECT inuse FROM items WHERE id = $<item_id>),
        current = (SELECT current FROM items WHERE id = $<item_id>) - $<amount>
    WHERE id = $<item_id>
  `;

    await db.any(q2, { ...model });
    const respond = await db.any(query, { ...model });
    return respond;
  } catch (error) {
    console.log(`failed adding a borrow ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_borrow_service = async (model: Borrow) => {
  console.log(`Updating borrow ${model.id}`);
  try {
    const query = `UPDATE borrow 
                    SET changed = $<changed> 
                    WHERE id = $<id>`;
    // inuse = inuse - oldBorrowamount + newAmount
    // current = current + oldBorrowamount + newAmount
    const q2 = `
    UPDATE items
    SET changed = (SELECT changed FROM items WHERE id = $<item_id>) - (SELECT changed FROM borrow WHERE id = $<id>) + $<changed> 
    WHERE id = $<item_id>
  `;
    //   // first update items then borrows
    await db.any(q2, { ...model });
    const respond = await db.none(query, { ...model });
    return respond;
  } catch (error) {
    console.log(`failed updating a borrow ${error}`);
    return ({ error: `DB error` });
  }
}

export const remove_borrow_service = async (id: number, item_id: number, amount: number, changed: number) => {
  console.log(`Deleting borrow ${id}`);

  try {
    const query = `DELETE FROM borrow WHERE id = $<id>`;
    // const backup = `INSERT INTO delete_events (username,data,tablename) 
    // SELECT $1, borrow.*, $2 
    // FROM borrow`;
    // const tname = 'borrow'
    // const respond=await db.any(backup, [username, tname]);

    const q2 = `
    UPDATE items
    SET inuse = (SELECT inuse FROM items WHERE id = $<item_id>) - $<amount>,
        current = (SELECT current FROM items WHERE id = $<item_id>) + $<amount>, 
        changed = (SELECT changed FROM items WHERE id = $<item_id>) - $<changed> WHERE id = $<item_id>
  `;
    // first update items then borrows
    await db.any(q2, { item_id, amount, changed });
    const respond = await db.none(query, { id });
    return respond;
  } catch (error) {
    console.log(`failed deleting a borrow ${error}`);
    return ({ error: `DB error` });
  }
}

export const borrow_documents_for_warehouse_service = async (warehouse_id: number) => {
  console.log(`Getting borrow documents for warehouse ${warehouse_id}`)
  try {
    const q = `SELECT borrow.*, 
                items.name as item_name, items.cates_id, items.warehouse_id, items.inuse, items.current, items.returned, 
                cates.name as cates_name, cates.unit_type, 
                employees.name as employee_name, 
                warehouse.name as warehouse_name 
                FROM borrow, items, cates, employees, warehouse 
                WHERE borrow.item_id = items.id 
                and items.cates_id = cates.id 
                and items.warehouse_id = warehouse.id
                and items.warehouse_id = $<warehouse_id> 
                and borrow.employee_id = employees.id`
    const documents = await db.any(q, { warehouse_id });
    return documents;
  } catch (error) {
    console.log(`failed getting borrow documents ${error}`);
    return ({ error: `DB error` });
  }
}