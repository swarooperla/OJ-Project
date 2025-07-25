import express from 'express'
import { controlCreateProblem, deleteProb, getHiddenTestcases, getProbById, getprobs, updateProblem } from '../controllers/problemController.js';
const router = express.Router();

router.post('/createProblem', controlCreateProblem)
router.get('/getProblems', getprobs);
router.delete('/deleteProblem/:id', deleteProb);
router.get('/getProbById/:id', getProbById);
router.get('/getHiddenTestcases/:id', getHiddenTestcases);
router.put('/updateProblem/:id', updateProblem)
export default router;