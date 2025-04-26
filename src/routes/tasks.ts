import { Router, Response } from 'express';
import { Task } from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';

const router = Router();

// Obtener todas las tareas del usuario
router.get(
  '/',
  requireAuth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tasks = await Task.find({ owner: req.user!.id });
      res.json({ ok: true, tasks });
    } catch (err) {
      res.status(500).json({ ok: false, error: 'Error al obtener tareas' });
    }
  }
);

// Crear una tarea
router.post(
  '/',
  requireAuth,
  [
    body('title')
      .notEmpty()
      .withMessage('El título es obligatorio'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('dueDate debe ser fecha ISO'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, dueDate } = req.body;
      const task = await Task.create({
        title,
        description,
        dueDate,
        owner: req.user!.id
      });
      res.status(201).json({ ok: true, task });
    } catch (err) {
      res.status(500).json({ ok: false, error: 'Error al crear tarea' });
    }
  }
);

// Actualizar una tarea
router.put(
  '/:id',
  requireAuth,
  [
    param('id')
      .isMongoId()
      .withMessage('ID de tarea inválido'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('completed debe ser booleano'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await Task.findOneAndUpdate(
        { _id: id, owner: req.user!.id },
        req.body,
        { new: true }
      );
      if (!task) {
        res.status(404).json({ ok: false, error: 'No encontrada' });
        return;
      }
      res.json({ ok: true, task });
    } catch (err) {
      res.status(500).json({ ok: false, error: 'Error al actualizar tarea' });
    }
  }
);

// Eliminar una tarea
router.delete(
  '/:id',
  requireAuth,
  [
    param('id')
      .isMongoId()
      .withMessage('ID de tarea inválido'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await Task.findOneAndDelete({ _id: id, owner: req.user!.id });
      if (!result) {
        res.status(404).json({ ok: false, error: 'No encontrada' });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: 'Error al eliminar tarea' });
    }
  }
);

export default router;
