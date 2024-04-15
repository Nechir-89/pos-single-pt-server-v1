import { RequestHandler, Response } from 'express'
import { InvoiceRequestBody } from '../../types/Invoice.types';
import { add_invoice_and_items_service, get_invoice_document_by_offset_service } from '../services/invoices_service';

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

export const get_invoice_document_by_offset: RequestHandler<
  never,
  Response,
  {offset: number},
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_invoice_document_by_offset_service(req.body.offset);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


