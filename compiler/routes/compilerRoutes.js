import express from 'express';
import { executeRun, executeSubmit } from '../controllers/compilerController.js';
const router = express.Router();

router.post('/run', executeRun);
router.post('/submit', executeSubmit);
export default router