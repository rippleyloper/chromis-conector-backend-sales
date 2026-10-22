import { Request, Response } from 'express';
import { chromisConnectionStatus, chromisSchema } from '../services/chromis.service';
import { respondError } from '../utils/http';

export async function getConnection(_req: Request, res: Response) {
  try { res.json(await chromisConnectionStatus()); }
  catch (error) { respondError(res, error); }
}
export async function getSchema(_req: Request, res: Response) {
  try { res.json(await chromisSchema()); }
  catch (error) { respondError(res, error); }
}
