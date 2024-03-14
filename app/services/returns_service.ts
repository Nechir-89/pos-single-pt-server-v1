import { Return } from "../../types/return.types";
import { db } from "../database/db";

export const get_returns_service = async () => {
  console.log(`Getting returns`);
  try {
    const respond: Return[] = await db.any(`SELECT * FROM returns`);
    return respond;
  } catch (error) {
    console.log(`failed getting returns ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_return_service = async (id: number) => {
  console.log(`Getting return ${id}`)
  try {
    const query = `SELECT * FROM returns WHERE id = $<id>`;
    const respond: Return | null = await db.oneOrNone(query, { id });
    return respond;
  } catch (error) {
    console.log(`failed getting return ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_return_service = async (model: Omit<Return, "id">) => {
  console.log(`Add new return for: ${model.employee_id}`);
  try {
    const query = `INSERT INTO returns (employee_id,item_id,returned_amount,date, note, username, barcode)
                    VALUES ($<employee_id>,$<item_id>,$<returned_amount>,$<date>,$<note>,$<username>,$<barcode>)`
    const q2 = `
                    UPDATE items
                    SET returned = $<returned_amount> + (SELECT returned FROM items WHERE id = $<item_id>),
                        current = (SELECT current FROM items WHERE id = $<item_id>) + $<returned_amount>
                    WHERE id = $<item_id>
                  `;

    await db.any(q2, { ...model });
    const respond = await db.any(query, { ...model });
    return respond;
  } catch (error) {
    console.log(`failed adding a return ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_return_service = async (model: Return) => {
  console.log(`Updating return ${model.id}`);
  try {
    const query = `UPDATE returns 
                    SET employee_id = $<employee_id>, item_id = $<item_id>,
                    returned_amount = $<returned_amount>, date = $<date>, note = $<note>
                    WHERE id = $<id>`;
    // returned = returned - oldamount + newAmount
    // current = current + oldamount + newAmount  90 + 5 - 
    const q2 = `
    UPDATE items
    SET returned = (SELECT returned FROM items WHERE id = $<item_id>) - (SELECT returned_amount From returns WHERE id=$<id>) + $<returned_amount>,
        current = (SELECT current FROM items WHERE id = $<item_id>) - ((SELECT returned_amount From returns WHERE id=$<id>) - $<returned_amount>)
    WHERE id = $<item_id>
  `;
    // first update items then borrows
    await db.any(q2, { ...model });
    const respond = await db.none(query, { ...model });
    return respond;
  } catch (error) {
    console.log(`failed updating a return ${error}`);
    return ({ error: `DB error` });
  }
}

export const remove_return_service = async (id: number, item_id: number, returned_amount: number) => {
  console.log(`Deleting return ${id}`);
  try {
    const query = `DELETE FROM returns WHERE id = $<id>`;
    const q2 = `
    UPDATE items
    SET returned = (SELECT returned FROM items WHERE id = $<item_id>) - $<returned_amount>,
        current = (SELECT current FROM items WHERE id = $<item_id>) - $<returned_amount>
    WHERE id = $<item_id>
  `;
    // first update items then borrows
    await db.any(q2, { item_id, returned_amount });
    const respond = await db.none(query, { id });
    return respond;
  } catch (error) {
    console.log(`failed deleting a return ${error}`);
    return ({ error: `DB error` });
  }
}


export const returned_documents_for_warehouse_service = async (warehouse_id: number) => {
  console.log(`Getting borrow documents for warehouse ${warehouse_id}`)
  try {
    const q = `SELECT returns.*, 
                items.name as item_name, items.cates_id, items.warehouse_id, items.inuse, items.current, items.returned, 
                cates.name as cates_name, cates.unit_type, 
                employees.name as employee_name, 
                warehouse.name as warehouse_name 
                FROM returns, items, cates, employees, warehouse 
                WHERE returns.item_id = items.id 
                and items.cates_id = cates.id 
                and items.warehouse_id = warehouse.id 
                and items.warehouse_id = $<warehouse_id>  
                and returns.employee_id = employees.id`
    const documents = await db.any(q, { warehouse_id });
    return documents;
  } catch (error) {
    console.log(`failed getting borrow documents ${error}`);
    return ({ error: `DB error` });
  }
}
