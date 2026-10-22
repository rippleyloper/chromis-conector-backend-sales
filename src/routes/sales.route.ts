import { Router } from 'express';
import { getProducts } from '../controllers/sales.controller'; // Ajusta la ruta de importación

const router = Router();

// 👈 Aquí lo llamas en el .get del router
router.get('/getProducts', getProducts);

export default router;