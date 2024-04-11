import { RequestHandler, Response } from 'express'
import { InvoiceRequestBody } from '../../types/Invoice.types';
import { add_invoice_and_items_service } from '../services/invoices_service';

export const add_invoice: RequestHandler<
  never,
  Response,
  InvoiceRequestBody,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_invoice_and_items_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


