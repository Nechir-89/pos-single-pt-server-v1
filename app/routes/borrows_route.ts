import { Router } from "express";
import {
  get_borrows,
  get_borrow,
  add_borrow,
  update_borrow,
  remove_borrow,
  borrow_documents_for_warehouse
} from "../controllers/borrows_controller";

const router = Router();

router.get('/', get_borrows);
router.get('/:id', get_borrow);

router.post('/', add_borrow);
router.post('/warehouse_documents', borrow_documents_for_warehouse);

router.put('/', update_borrow);

router.delete('/:id', remove_borrow);

export default router;
