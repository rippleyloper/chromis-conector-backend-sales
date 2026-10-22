import { Request, Response } from 'express';
import { fetchProductById, fetchProductsList } from '../services/products.service';
import { pagination } from '../utils/request';
import { respondError } from '../utils/http';

export async function getProductList(req: Request, res: Response) {
  try {
    const { page, limit } = pagination(req);
    res.json(await fetchProductsList(page, limit,
      typeof req.query.search === 'string' ? req.query.search : undefined,
      typeof req.query.category === 'string' ? req.query.category : undefined));
  } catch (error) { respondError(res, error); }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const item = await fetchProductById(req.params.id);
    if (!item) { res.status(404).json({ error: 'Producto no encontrado' }); return; }
    res.json(item);
  } catch (error) { respondError(res, error); }
}
