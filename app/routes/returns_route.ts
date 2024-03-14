import { Router } from "express";
import {
  get_returns,
  get_return,
  add_return,
  update_return,
  remove_return,
  returned_documents_for_warehouse
} from "../controllers/returns_controller";

const router = Router();

router.get('/', get_returns);
router.get('/:id', get_return);

router.post('/', add_return);
router.post('/warehouse_documents', returned_documents_for_warehouse);

router.put('/', update_return);

router.delete('/:id', remove_return);

export default router;
