import { Router } from "express";
import {
  add_stock,
  get_stocks
} from "../controllers/stocks_controller";

const router = Router();

router.get('/', get_stocks);
router.post('/', add_stock)

export default router;
