import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import listRouter from "./routes/listRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

app.use("/user", userRouter);
app.use("/list", listRouter);
