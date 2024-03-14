import { RequestHandler, Response } from "express";
import {
  add_cate_service,
  get_cates_service,
  get_cate_service,
  remove_cate_service,
  update_cate_service
} from "../services/cates_service";
import { Cates } from "../../types/cates.types";


export const get_cates: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_cates_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const get_cate: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_cate_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const add_cate: RequestHandler<
  never,
  Response,
  Omit<Cates, "id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_cate_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const update_cate: RequestHandler<
  never,
  Response,
  Cates,
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_cate_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const remove_cate: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await remove_cate_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`Server runnign into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
}
