import { RequestHandler, Response } from 'express'
import { search_last_stock_barcode_service } from '../services/general_queries_service';

export const search_last_stock_barcode: RequestHandler<
  never,
  Response,
  {barcode: string},
  never
> = async (req, res: Response) => {
  try {
    const response = await search_last_stock_barcode_service(req.body.barcode);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}
