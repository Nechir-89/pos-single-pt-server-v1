import { RequestHandler, Response } from "express";
import {
  get_all_warehouses_service,
  get_warehouse_service,
  add_warehouse_service,
  update_warehouse_service,
  remove_warehouse_service
} from "../services/warehouse_service";
import { Warehouse } from "../../types/warehouse.types";
// import { response_error } from "../../types/respond.types";



export const get_all_warehouses: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {

  try {
    const response = await get_all_warehouses_service();
    //@ts-ignore
    response?.error ? res.status(501).json(response) : res.status(200).json(response);
  } catch (error) {
    console.log(`Server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const get_warehouse: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await get_warehouse_service(Number(req.params.id));
    //@ts-ignore
    response?.error ? res.status(501).json(response) : res.status(200).json(response);
  } catch (error) {
    console.log(`Server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
}

export const add_warehouse: RequestHandler<
  never,
  Response,
  Omit<Warehouse, "id">,
  never
> = async (req, res: Response) => {
  try {
    const response = await add_warehouse_service(req.body);
    response?.error ? res.status(501).json(response) : res.status(201).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const update_warehouse: RequestHandler<
  never,
  Response,
  Warehouse,
  never
> = async (req, res: Response) => {
  try {
    const response = await update_warehouse_service(req.body);
    response?.error ? res.status(501).json(response) : res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const remove_warehouse: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await remove_warehouse_service(Number(req.params.id));
    response?.error ? res.status(501).json(response) : res.status(200).json(response);
  } catch (error) {
    console.log(`Server runnign into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
}
