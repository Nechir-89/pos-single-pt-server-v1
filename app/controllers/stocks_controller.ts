import { RequestHandler, Response } from 'express'
import {
  get_stocks_service,
  add_stock_service,
  delete_stock_service
} from '../services/stocks_service'
import { Stock } from '../../types/Stock.types';

export const get_stocks: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_stocks_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const add_stock: RequestHandler<
  never,
  Response,
  Omit<Stock, "stocking_id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_stock_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const delete_stock: RequestHandler<
  never,
  Response,
  { stocking_id: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await delete_stock_service(req.body.stocking_id);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
