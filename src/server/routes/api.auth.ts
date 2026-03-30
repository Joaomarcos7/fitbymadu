import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production';
const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'] ?? 'fitbymadu123';

router.post('/login', (req, res) => {
  const { password } = req.body as { password: string };
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

export default router;
