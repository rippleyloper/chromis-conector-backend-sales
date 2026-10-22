import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export async function chromisConnectionStatus() {
  await pool.query('SELECT 1');
  return { database: 'connected' };
}

export async function chromisSchema() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT table_name AS tableName FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name IN
     ('products','categories','tickets','receipts','ticketlines','payments','stockcurrent','stockdiary')
     ORDER BY table_name`
  );
  return { tables: rows.map(row => row.tableName) };
}
