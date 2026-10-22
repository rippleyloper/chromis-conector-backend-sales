import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.route';
import salesRoutes from './routes/sales.route';
import categoryRoutes from './routes/categories.route';
import chromisRoutes from './routes/chromis.route';
import { pool } from './config/database';

dotenv.config();
const app = express();
const origins = process.env.CORS_ORIGINS?.split(',').map(value => value.trim()).filter(Boolean);
app.use(cors({ origin: origins?.length ? origins : false }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'OK', service: 'chromis-conector-backend-sales' }));
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chromis', chromisRoutes);
app.use((_req, res) => res.status(404).json({ error: 'Endpoint no encontrado' }));

const port = Number(process.env.PORT || 4000);
app.listen(port, async () => {
  console.log(`Chromis API escuchando en puerto ${port}`);
  try { await pool.query('SELECT 1'); console.log('Base de datos conectada'); }
  catch (error) { console.error('Error de conexión a la base de datos', error); }
});
