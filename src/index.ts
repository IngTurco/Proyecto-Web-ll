import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRouter from './routes/auth';
import { requireAuth, AuthRequest } from './middleware/auth';
import tasksRouter from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';



dotenv.config();

// Verificación de la JWT
console.log('🔐 JWT_SECRET is:', process.env.JWT_SECRET);


const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRouter);
app.use(errorHandler);

// Monto router de auth
app.use('/api/auth', authRouter);

// Ruta protegida de ejemplo
app.get(
  '/api/profile',
  requireAuth,
  (req: AuthRequest, res) => {
    res.json({ ok: true, user: req.user });
    res.send('API on');
  }
);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🔊 Server corriendo en http://localhost:${PORT}`);
  });
});
