import { Router } from 'express';
import { getConnection, getSchema } from '../controllers/chromis.controller';
const router = Router();
router.get('/connection', getConnection);
router.get('/schema', getSchema);
export default router;
