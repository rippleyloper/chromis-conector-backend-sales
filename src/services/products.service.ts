import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export async function fetchProductsList(page: number, limit: number, search?: string, category?: string) {
  const filters: string[] = [];
  const params: unknown[] = [];
  if (search) {
    filters.push('(p.name LIKE ? OR p.reference LIKE ? OR p.code LIKE ?)');
    params.push(...Array(3).fill('%' + search + '%'));
  }
  if (category) {
    filters.push('p.category = ?');
    params.push(category);
  }
  const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.reference, p.code, p.name, p.pricebuy, p.pricesell, p.category AS categoryId, c.name AS categoryName
     FROM products p LEFT JOIN categories c ON c.id = p.category
     ${where} ORDER BY p.name LIMIT ? OFFSET ?`, [...params, limit, (page - 1) * limit]
  );
  const [totals] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM products p ${where}`, params
  );
  return { data: rows, total: Number(totals[0].total), page, limit };
}

export async function fetchProductById(id: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT p.*, c.name AS categoryName FROM products p LEFT JOIN categories c ON c.id = p.category WHERE p.id = ? LIMIT 1', [id]
  );
  return rows[0] || null;
}
