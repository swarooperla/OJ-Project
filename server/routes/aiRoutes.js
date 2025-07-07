import express from 'express'
import generateAiResponse from '../services/generateAiResponse.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { code } = req.body;
    if( code === undefined || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Empty code! Please provide some code to review."
        });
    }
    try {
        const aiResponse = await generateAiResponse(code);
        res.json({
            success: true,
            aiResponse
        })
        
    } catch (error) {
        console.error('Error executing review: ', error.message);
    }
});
export default router