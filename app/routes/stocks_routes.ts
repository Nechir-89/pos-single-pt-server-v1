import { Router } from "express";
import {
  add_stock,
  delete_stock,
  get_stocks
} from "../controllers/stocks_controller";

const router = Router();

router.get('/', get_stocks);
router.post('/', add_stock);
router.delete('/', delete_stock);

export default router;
