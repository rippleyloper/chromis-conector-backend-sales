import { Request, Response } from 'express';
import { fetchProductsService } from '../services/sales.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Llama al servicio encargado de la lógica y los datos
    const products = await fetchProductsService(page, limit);

    res.json({
      page,
      limit,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
};