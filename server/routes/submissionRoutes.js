import express from 'express';
import { addSubmission, getUserSubmissions } from '../controllers/submissionsController.js';
const router = express.Router();

router.post('/addSubmission', addSubmission);
router.get('/user', getUserSubmissions);
export default router;