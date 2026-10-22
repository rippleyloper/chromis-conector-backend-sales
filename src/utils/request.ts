import { Request } from 'express';

export function pagination(req: Request) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error('page debe ser >= 1 y limit entre 1 y 100');
  }
  return { page, limit, offset: (page - 1) * limit };
}

export function dateRange(req: Request) {
  const from = req.query.from === undefined ? undefined : String(req.query.from);
  const to = req.query.to === undefined ? undefined : String(req.query.to);
  const valid = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
  if ((from && !valid(from)) || (to && !valid(to)) || (from && to && from > to)) {
    throw new Error('Fechas inválidas; usa from y to en formato YYYY-MM-DD');
  }
  return { from, to };
}
