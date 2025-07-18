import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js'
import DBconnection from './database/db.js';
import submissionRoutes from './routes/submissionRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import dotenv from 'dotenv';
const app = express();
app.use(cors());
dotenv.config();
DBconnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes)
app.use('/api/submissions', submissionRoutes);
app.use('/ai-review', aiRoutes);
app.get("/test", (req, res) => {
    res.send("Server's server is alive!");
  });

app.listen(8000, '0.0.0.0', () => {
    console.log("Server is running on port 8000");
})
