import express from 'express'
import { controlCreateProblem, deleteProb, getProbById, getprobs, updateProblem } from '../controllers/problemController.js';
const router = express.Router();

router.post('/createProblem', controlCreateProblem)
router.get('/getProblems', getprobs);
router.delete('/deleteProblem/:id', deleteProb);
router.get('/getProbById/:id', getProbById);
router.put('/updateProblem/:id', updateProblem)
export default router;