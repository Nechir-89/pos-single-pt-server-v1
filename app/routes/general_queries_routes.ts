import { Router } from "express";
import { search_last_stock_barcode } from "../controllers/general_queries_controller";

const router = Router();

router.post('/laststockbybarcode', search_last_stock_barcode)

export default router;
