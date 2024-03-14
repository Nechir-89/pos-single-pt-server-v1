import { Router } from "express";
import {
  add_cate,
  get_cates,
  get_cate,
  remove_cate,
  update_cate
} from "../controllers/cates_controller";

const router = Router();

router.get('/', get_cates);
router.get('/:id', get_cate);

router.post('/', add_cate);

router.put('/', update_cate);

router.delete('/:id', remove_cate);

export default router;
