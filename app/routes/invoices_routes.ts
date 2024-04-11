import { Router } from "express";
import { add_invoice } from "../controllers/invoices_controller";
const router = Router();

router.post('/', add_invoice)

export default router;