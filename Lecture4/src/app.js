import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);//if we fill form then there is a limit of 16kb to fill the form

//to get data from url -> the url has its own encoder that converts the data 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//if files and folders are uploaded then to get the data from them and to store them in the server 
//making public assets
app.use(express.static("public"));


// to acccess and set user cookies [ONLY SERVER CAN READ AND WRITE COOKIES]
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
//we use app.get when we write routes and controllers in same file but since we wrote it in 
//different files we use app.use ie middleware

// app.use("/users", userRouter);
// http://localhost:8000/users/register

app.use('/api/v1/users', userRouter);
// http://localhost:8000/api/v1/users/register


export  {app};
