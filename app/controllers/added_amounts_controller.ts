import { RequestHandler, Request, Response } from 'express'
import {
  get_added_amount_service,
  get_all_added_amounts_service,
  get_all_documents_service,
  get_item_added_amounts_service,
  get_warehouse_added_amounts_service,
  get_warehouse_documents_service,
  get_warehouse_item_documents_service,
  add_amount_service,
  remove_amount_service
} from '../services/added_amounts_service'
import { AddedAmount } from '../../types/added_amounts.types';

export const get_all_added_amounts: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_all_added_amounts_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_warehouse_added_amounts: RequestHandler<
  never,
  Response,
  { warehouseId: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_warehouse_added_amounts_service(Number(req.body.warehouseId));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_item_added_amounts: RequestHandler<
  never,
  Response,
  { itemId: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_item_added_amounts_service(Number(req.body.itemId));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_added_amount: RequestHandler<
  { id: number },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_added_amount_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_all_documents: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_all_documents_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const get_warehouse_documents: RequestHandler<
  never,
  Response,
  { warehouseId: string },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_warehouse_documents_service(Number(req.body.warehouseId));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
export const get_warehouse_item_documents: RequestHandler<
  never,
  Response,
  { warehouseId: number, itemId: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_warehouse_item_documents_service(Number(req.body.warehouseId), Number(req.body.itemId));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


export const add_amount: RequestHandler<
  never,
  Response,
  Omit<AddedAmount, "id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_amount_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


export const remove_amount: RequestHandler<
  never,
  Response,
  AddedAmount,
  never
> = async (req, res: Response) => {
  try {
    const respond = await remove_amount_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n${error}`);
    res.status(500).json({ error: "Server error" });
  }
}