import express, { Application, Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import salesRoute from './routes/sales.route';
import productRoute from './routes/product.route';
// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/api/sales', salesRoute);
app.use('/api/products', productRoute);
// Configuración del Pool de conexiones a MariaDB (usando promesas para async/await)
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'compu_pos', // Cambia por el nombre de tu BD
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Comprobar la conexión a la base de datos al iniciar el servidor
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado exitosamente a MariaDB / Chromis POS');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}

testDatabaseConnection();

// Ruta de prueba básica
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Servidor de Chromis Conector funcionando correctamente' });
});
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación opcionales (ej: /api/productos?page=1&limit=10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const query = 'SELECT id, name, pricebuy, pricesell FROM products LIMIT ? OFFSET ?';
    
    // Importante: con mysql2/promise, pasamos los valores de LIMIT y OFFSET 
    // pero debemos castearlos a números o usar query con desestructuración.
    const [rows] = await pool.query<any[]>(query, [limit, offset]);

    res.json({
      page,
      limit,
      data: rows
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
};
app.get('/api/productos', getProducts);

// Aquí puedes registrar tus rutas en el futuro, por ejemplo:
// import salesRoutes from './routes/sales.routes';
// app.use('/api/sales', salesRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});