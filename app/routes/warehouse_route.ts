import { Router } from "express";
import {
  get_all_warehouses,
  get_warehouse,
  add_warehouse,
  update_warehouse,
  remove_warehouse
} from "../controllers/warehouse_controller";

const router = Router();

// router.get('/', get_nexttodos_for_one_task);
router.get('/', get_all_warehouses);
router.get('/:id', get_warehouse);

router.post('/', add_warehouse);

router.put('/', update_warehouse);

router.delete('/:id', remove_warehouse);

export default router;
