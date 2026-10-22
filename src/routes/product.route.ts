import { Router } from 'express';
import { getProductList } from '../controllers/product.controller'; // Ajusta la ruta de importación

const router = Router();

// 👈 Aquí lo llamas en el .get del router
router.get('/list', getProductList);

export default router;