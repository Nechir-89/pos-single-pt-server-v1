import { Router } from "express";
import {
  get_stocks_states,
  add_stock_state,
  delete_stock_state,
  get_stocks_states_docs,
  get_stocks_states_docs_by_barcode,
  get_stocks_states_docs_by_item_name
} from "../controllers/states_controller";

const router = Router();

// api/states/stocks/
router.get('/', get_stocks_states);
router.post('/', add_stock_state)
router.get('/docs', get_stocks_states_docs)
router.post('/docsbybarcode', get_stocks_states_docs_by_barcode)
router.post('/docsbyitemname', get_stocks_states_docs_by_item_name)
router.delete('/', delete_stock_state)

export default router;
