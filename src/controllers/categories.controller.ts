import { Request, Response } from 'express';
import { fetchCategories } from '../services/categories.service';
import { respondError } from '../utils/http';

export async function getCategories(_req: Request, res: Response) {
  try { res.json({ data: await fetchCategories() }); }
  catch (error) { respondError(res, error); }
}
