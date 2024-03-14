import { RequestHandler, Response } from "express";
import {
  get_employees_service,
  get_employee_service,
  add_employee_service,
  update_employee_service,
  remove_employee_service
} from '../services/employees_service'
import { Employee } from "../../types/employee.types";

export const get_employees: RequestHandler<
  never, // uri param
  Response, // response
  never, // request
  never // query params
> = async (req, res: Response) => {
  try {
    const respond = await get_employees_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_employee: RequestHandler<
  { id: string }, // uri param
  Response, // response
  never, // request
  never // query params
> = async (req, res: Response) => {
  try {
    const respond = await get_employee_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const add_employee: RequestHandler<
  never, // uri param
  Response, // response
  Omit<Employee, "id">, // request body
  never // query params
> = async (req, res: Response) => {

  try {
    const respond = await add_employee_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log("server running into an error");
    res.status(500).json({ error: "Server error" });
  }
}

export const update_employee: RequestHandler<
  never, // uri param
  Response, // response
  Employee, // request
  never // query params
> = async (req, res: Response) => {
  try {
    const respond = await update_employee_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const remove_employee: RequestHandler<
  { id: string }, // uri param
  Response, // response
  never, // request
  never // query params
> = async (req, res: Response) => {
  try {
    const respond = await remove_employee_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log("server running into an error");
    res.status(500).json({ error: "Server error" });
  }
}
