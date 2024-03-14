import { Router } from 'express'
import {
  get_employees,
  get_employee,
  add_employee,
  update_employee,
  remove_employee
} from '../controllers/employees_constroller';

const router = Router();

router.get('/', get_employees);
router.get('/:id', get_employee);

router.post('/', add_employee);

router.put('/', update_employee);

router.delete('/:id', remove_employee);

export default router;