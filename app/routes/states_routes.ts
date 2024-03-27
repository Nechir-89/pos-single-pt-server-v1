import { Router } from "express";
import {
  get_stocks_states,
  add_stock_state,
  delete_stock_state
} from "../controllers/states_controller";

const router = Router();

router.get('/', get_stocks_states);
router.post('/', add_stock_state)
router.delete('/', delete_stock_state)

export default router;
