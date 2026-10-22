import { pool } from '../index';
import { RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
  id: string;
  name: string;
  pricebuy: number;
  pricesell: number;
}

export const fetchProductsService = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const query = 'SELECT id, name, pricebuy, pricesell FROM products LIMIT ? OFFSET ?';
  
  const [rows] = await pool.query<ProductRow[]>(query, [limit, offset]);

  // Aquí podrías aplicar lógica de negocio si la necesitas (ej: transformar precios, calcular impuestos, etc.)
  const processedProducts = rows.map(product => ({
    ...product,
    pricesellWithTax: product.pricesell * 1.19 // Ejemplo de lógica de negocio
  }));

  return processedProducts;
};