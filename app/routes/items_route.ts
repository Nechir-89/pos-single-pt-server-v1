import { Router } from "express";
import {
  get_items,
  get_item,
  add_item,
  update_item,
  remove_item,
  get_all_items,
  get_warehouse_documents,
  update_removed_amount,
  get_warehouse_item_documents_based_on_barcode,
  clean_damaged_goods,
  move_changed_to_damaged
} from "../controllers/items_controller";

const router = Router();

router.get('/', get_items);
router.get('/all', get_all_items);
router.get('/:id', get_item);

router.post('/', add_item);
router.post('/warehouse_documents', get_warehouse_documents);
router.post('/removed_amount', update_removed_amount);
router.post('/clean_damaged_goods', clean_damaged_goods);
router.post('/move_changed_to_damaged', move_changed_to_damaged);
router.post('/warehouse_item_documents_based_on_barcode', get_warehouse_item_documents_based_on_barcode);

router.put('/', update_item);

router.delete('/:id', remove_item);

export default router;