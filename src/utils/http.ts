import { Response } from 'express';

export function respondError(res: Response, error: unknown) {
  if (error instanceof Error && /^(page debe|Fechas inválidas)/.test(error.message)) {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: 'Error al consultar Chromis POS' });
}
