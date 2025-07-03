import express from "express";
import cors from 'cors';
import compilerRoutes from './routes/compilerRoutes.js'
const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Server is alive!");
});
app.use('/api/compiler', compilerRoutes);   

app.listen(9000, () => {
    console.log("Compiler is running at port 9000");
})