import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Registro de usuario
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('El email debe ser válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      // Verificar si el usuario ya existe
      if (await User.exists({ email })) {
        res.status(400).json({ ok: false, msg: 'Usuario ya registrado' });
        return;
      }
      // Hash de la contraseña
      const hashed = await bcrypt.hash(password, 10);
      // Crear y guardar el usuario
      await new User({ email, password: hashed }).save();
      res.status(201).json({ ok: true, msg: 'Usuario creado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
  }
);

// Login de usuario
type Payload = { uid: string; email: string };

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('El email debe ser válido'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria'),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
        return;
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
        return;
      }
      // Firmar token con uid y email
      const token = jwt.sign({ uid: user.id, email: user.email } as Payload, JWT_SECRET, {
        expiresIn: '2h',
      });
      res.json({ ok: true, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
  }
);

export default router;
