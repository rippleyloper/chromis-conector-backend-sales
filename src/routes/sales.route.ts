import { Router } from 'express';
import { getSale, getSales, getSalesSummary } from '../controllers/sales.controller';
const router = Router();
router.get('/', getSales);
router.get('/summary', getSalesSummary);
router.get('/:id', getSale);
export default router;
