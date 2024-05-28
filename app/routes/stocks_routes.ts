import { Router } from "express";
import {
  add_stock,
  delete_stock,
  get_stocks,
  update_stock_expire_date,
  update_stock_barcodes,
  delete_stock_2
} from "../controllers/stocks_controller";

const router = Router();

router.get('/', get_stocks);
router.post('/', add_stock);
router.delete('/', delete_stock);
router.post('/delete', delete_stock_2)
router.put('/update/expire_date', update_stock_expire_date);
router.put('/update/barcodes', update_stock_barcodes);

export default router;
