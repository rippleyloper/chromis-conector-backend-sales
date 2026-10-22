import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export async function fetchSales(page: number, limit: number, from?: string, to?: string) {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (from) { conditions.push('r.datenew >= ?'); params.push(from + ' 00:00:00'); }
  if (to) { conditions.push('r.datenew < DATE_ADD(?, INTERVAL 1 DAY)'); params.push(to); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.id, t.ticketid, t.status, r.datenew AS date,
            COALESCE((SELECT SUM(tl.units * tl.price) FROM ticketlines tl WHERE tl.ticket = t.id),0) AS subtotal,
            COALESCE((SELECT SUM(pay.total) FROM payments pay WHERE pay.receipt = t.id),0) AS paidTotal
       FROM tickets t JOIN receipts r ON r.id = t.id
       ${where} ORDER BY r.datenew DESC, t.id DESC LIMIT ? OFFSET ?`,
    [...params, limit, (page - 1) * limit]
  );
  const [count] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM tickets t JOIN receipts r ON r.id = t.id ${where}`, params
  );
  return { data: rows, total: Number(count[0].total), page, limit };
}

export async function fetchSaleById(id: string) {
  const [tickets] = await pool.query<RowDataPacket[]>(
    'SELECT t.*, r.datenew AS date FROM tickets t JOIN receipts r ON r.id=t.id WHERE t.id=? LIMIT 1', [id]
  );
  if (!tickets.length) return null;
  const [lines] = await pool.query<RowDataPacket[]>(
    `SELECT tl.*, p.name AS productName, p.reference FROM ticketlines tl
      LEFT JOIN products p ON p.id=tl.product WHERE tl.ticket=? ORDER BY tl.line`, [id]
  );
  const [payments] = await pool.query<RowDataPacket[]>(
    'SELECT payment, total FROM payments WHERE receipt=?', [id]
  );
  return { ...tickets[0], lines, payments };
}

export async function fetchSalesSummary(from?: string, to?: string) {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (from) { conditions.push('r.datenew >= ?'); params.push(from + ' 00:00:00'); }
  if (to) { conditions.push('r.datenew < DATE_ADD(?, INTERVAL 1 DAY)'); params.push(to); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS tickets, COALESCE(SUM(payments.paidTotal),0) AS total
     FROM tickets t JOIN receipts r ON r.id=t.id
     LEFT JOIN (SELECT receipt, SUM(total) AS paidTotal FROM payments GROUP BY receipt) payments ON payments.receipt=t.id
     ${where}`, params
  );
  return rows[0];
}
