import { RequestHandler, Response } from "express";
import {
  get_borrows_service,
  get_borrow_service,
  add_borrow_service,
  update_borrow_service,
  remove_borrow_service,
  borrow_documents_for_warehouse_service
} from "../services/borrows_service";
import { Borrow } from "../../types/borrow.types";

export const get_borrows: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {

  try {
    const respond = await get_borrows_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const get_borrow: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_borrow_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const add_borrow: RequestHandler<
  never,
  Response,
  Omit<Borrow, "id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_borrow_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const update_borrow: RequestHandler<
  never,
  Response,
  Borrow,
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_borrow_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const remove_borrow: RequestHandler<
  { id: string },
  Response,
  never,
  { item_id: number, amount: number, changed: number }
> = async (req, res: Response) => {
  try {
    const respond = await remove_borrow_service(Number(req.params.id), Number(req.query.item_id), Number(req.query.amount), req.query.changed);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`Server runnign into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
}

export const borrow_documents_for_warehouse: RequestHandler<
  never,
  Response,
  { warehouse_id: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await borrow_documents_for_warehouse_service(Number(req.body.warehouse_id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`Server runnign into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
}
