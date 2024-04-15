import { Router } from "express";
import {
  add_invoice,
  get_invoice_document_by_offset
} from "../controllers/invoices_controller";
const router = Router();

router.post('/', add_invoice)
router.post('/invoice_document_by_offset', get_invoice_document_by_offset)

export default router;