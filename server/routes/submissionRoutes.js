import express from 'express';
import { addSubmission, getSubmissions } from '../controllers/submissionsController.js';
const router = express.Router();

router.post('/addSubmission', addSubmission);
router.get('', getSubmissions);
export default router;