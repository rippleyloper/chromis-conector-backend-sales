import { Request, Response } from 'express';
import { fetchSaleById, fetchSales, fetchSalesSummary } from '../services/sales.service';
import { pagination, dateRange } from '../utils/request';
import { respondError } from '../utils/http';

export async function getSales(req: Request, res: Response) {
  try {
    const { page, limit } = pagination(req);
    const { from, to } = dateRange(req);
    res.json(await fetchSales(page, limit, from, to));
  } catch (error) { respondError(res, error); }
}

export async function getSale(req: Request, res: Response) {
  try {
    const sale = await fetchSaleById(req.params.id);
    if (!sale) { res.status(404).json({ error: 'Venta no encontrada' }); return; }
    res.json(sale);
  } catch (error) { respondError(res, error); }
}

export async function getSalesSummary(req: Request, res: Response) {
  try { const { from, to } = dateRange(req); res.json(await fetchSalesSummary(from, to)); }
  catch (error) { respondError(res, error); }
}
