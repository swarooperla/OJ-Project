import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js'
import DBconnection from './database/db.js';
import submissionRoutes from './routes/submissionRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import dotenv from 'dotenv';
const app = express();
dotenv.config();
DBconnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:5173",                   // local dev
  "https://oj-project-theta.vercel.app"      // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
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
