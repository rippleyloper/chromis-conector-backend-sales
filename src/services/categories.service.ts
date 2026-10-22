import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export async function fetchCategories() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.id, c.name, COUNT(p.id) AS productCount FROM categories c
     LEFT JOIN products p ON p.category=c.id GROUP BY c.id, c.name ORDER BY c.name`
  );
  return rows;
}
