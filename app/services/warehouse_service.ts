import { Warehouse } from "../../types/warehouse.types";
import { response_error } from "../../types/respond.types";
import { db } from "../database/db";

export const get_all_warehouses_service = async () => {
  console.log(`Getting all warehouses`);
  try {
    const warehouses: Warehouse[] = await db.any(`SELECT * from warehouse`);
    return warehouses;
  } catch (error) {
    console.log(`Failed fetching warehouses because ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_warehouse_service = async (id: number) => {
  console.log(`Getting warehouse: ${id}`)
  try {
    const query = `SELECT * from warehouse WHERE id = $<id>`;
    const response: Warehouse | null = await db.oneOrNone(query, { id });
    return response;
  } catch (error) {
    console.log(`Failed at getting warehouse: ${id} because ${error}`)
    return ({ error: `DB error` });
  }
}

export const add_warehouse_service = async (model: Omit<Warehouse, "id">) => {
  console.log(`Adding new warehouse : ${model.name}`);
  try {
    const query = `INSERT INTO warehouse(name)
                    VALUES ($<name>)`;
    const response = await db.none(query, { ...model });
    return response;
  } catch (error) {
    console.log(`Failed at adding warehouse: ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_warehouse_service = async (model: Warehouse) => {
  console.log(`Updating warehouse: ${model.id}`);
  try {
    const query = `UPDATE warehouse
                      SET name = $<name>
                      WHERE id = $<id>`;
    const response = await db.none(query, model);
    return response;
  } catch (error) {
    console.log(`Failed at updating warehouse: ${error}`);
    return ({ error: "DB error" });
  }
}

export const remove_warehouse_service = async (id: number) => {
  console.log(`Deleting warehouse: ${id}`);
  try {
    const query = `DELETE FROM warehouse WHERE id=$<id>`;
    const response = await db.none(query, { id });
    return response;
  } catch (error) {
    console.log(`Failed deleting warehouse: ${error}`);
    return ({ error: "DB error" });
  }
}
