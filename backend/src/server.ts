import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/db';
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("I am working fine!");
})

app.listen(PORT, async () => {
    await dbConnect();
    console.log(`Server is running at port ${PORT}`)
})