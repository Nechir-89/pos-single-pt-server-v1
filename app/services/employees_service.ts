import { Employee } from "../../types/employee.types";
import { db } from "../database/db";

export const get_employees_service = async () => {
  console.log("getting all employees");
  try {
    const employees: Employee[] = await db.any(`SELECT * FROM employees`);
    return employees;
  } catch (error) {
    console.log(`failed getting employees ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_employee_service = async (id: number) => {
  console.log(`Getting employee ${id}`);
  try {
    const query = `SELECT * FROM  employees WHERE id=$<id>`;
    const employee: Employee | null = await db.oneOrNone(query, { id });
    return employee;
  } catch (error) {
    console.log(`failed getting employee ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_employee_service = async (model: Omit<Employee, "id">) => {
  console.log(`Adding new employee ${model.name}`);
  try {
    const query = `INSERT INTO employees (name, room) VALUES($<name>, $<room>)`;
    const employee: null = await db.none(query, { ...model });
    return employee;
  } catch (error) {
    console.log(`failed adding room ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_employee_service = async (model: Employee) => {
  console.log(`Updating employee ${model.id}: ${model.name}`);
  try {
    const query = `UPDATE employees 
    SET name = $<name>,
    room = $<room>
    WHERE id = $<id>`;
    const employee: null = await db.none(query, { ...model });
    return employee;
  } catch (error) {
    console.log(`failed updating employee ${error}`);
    return ({ error: `DB error` });
  }
}

export const remove_employee_service = async (id: number) => {
  console.log(`Deleting employee ${id}`);
  try {
    const query = `DELETE FROM employees WHERE id = $<id>`;
    const employee: null = await db.none(query, { id });
    return employee;
  } catch (error) {
    console.log(`failed deleting employee ${error}`);
    return ({ error: `DB error` });
  }
}
