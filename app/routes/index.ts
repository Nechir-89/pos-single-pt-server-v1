import { Router } from 'express';
import users_routes from './users_routes'
import auth_routes from './auth_routes'
import categories_routes from './categories_routes'
import units_routes from './units_routes'
import pcs_routes from './pcs_routes'

const router = Router();

router.use('/api/users', users_routes)
router.use('/auth', auth_routes)
router.use('/api/categories', categories_routes)
router.use('/api/units', units_routes)
router.use('/api/units/pcs', pcs_routes)

export default router;
