import express from "express";
import cors from 'cors';
import compilerRoutes from './routes/compilerRoutes.js'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:5173",                   
  "https://oj-project-theta.vercel.app",
  "https://bytecode.sbs"       
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

app.get("/test", (req, res) => {
  res.send("Server is alive!");
});
app.use('/api/compiler', compilerRoutes);   

app.listen(9000, () => {
    console.log("Compiler is running at port 9000");
})