import express from 'express';
import { getAllUsers, deleteUser, changeUserRole } from '../controllers/userController.js';

const router = express.Router();


router.get('/getAllUsers', getAllUsers)

router.delete('/deleteUser/:id', deleteUser)

router.put('/changeUserRole/:id', changeUserRole)


export default router