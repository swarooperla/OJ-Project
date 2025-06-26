import express from 'express';
import cors from 'cors';
import router from './routes/authRoutes.js';
import DBconnection from './database/db.js';
const app = express();
app.use(cors());

DBconnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})
