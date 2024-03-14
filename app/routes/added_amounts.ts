import { Router } from "express";
import {
  get_added_amount,
  get_all_added_amounts,
  get_item_added_amounts,
  get_warehouse_added_amounts,
  get_all_documents,
  get_warehouse_documents,
  get_warehouse_item_documents,
  add_amount,
  remove_amount
} from "../controllers/added_amounts_controller";

const router = Router();

router.get('/', get_item_added_amounts);
router.get('/all', get_all_added_amounts);
router.get('/warehouse', get_warehouse_added_amounts);
router.get('/all_documents', get_all_documents);
router.post('/warehouse_documents', get_warehouse_documents);
router.post('/warehouse_item_documents', get_warehouse_item_documents);

router.post('/', add_amount)
router.post('/delete', remove_amount)

router.get('/:id', get_added_amount);
// router.get('/all', get_all_items);
// router.get('/:id', get_item);

// router.post('/', add_item);

// router.put('/', update_item);

// router.delete('/:id', remove_item);

export default router;