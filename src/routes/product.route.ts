import { Router } from 'express';
import { getProductList, getProduct } from '../controllers/product.controller';
const router = Router();
router.get('/', getProductList);
router.get('/list', getProductList);
router.get('/:id', getProduct);
export default router;
