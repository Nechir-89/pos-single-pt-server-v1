import { Router } from 'express';
import users_routes from './users_routes'
import auth_routes from './auth_routes'
import categories_routes from './categories_routes'
import units_routes from './units_routes'
import pcs_routes from './pcs_routes'
import item_routes from './items_routes'
import stock_routes from './stocks_routes'
import states_router from './states_routes'
import { new_item } from '../middlewares/new_item';
import items_states_router from './items_states_routes'
import general_queries_router from './general_queries_routes'

const router = Router();

router.use('/api/users', users_routes)
router.use('/auth', auth_routes)
router.use('/api/categories', categories_routes)

router.use('/api/units', units_routes)
router.use('/api/units/pcs', pcs_routes)

router.use('/api/items', item_routes)
router.post('/api/items/new', new_item)

router.use('/api/states/stocks', states_router)
router.use('/api/states/items', items_states_router)

router.use('/api/stocks', stock_routes)

router.use('/api/general/stocks', general_queries_router)

export default router;
