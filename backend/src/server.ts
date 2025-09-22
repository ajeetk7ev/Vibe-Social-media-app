import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("I am working fine!");
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})