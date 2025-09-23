import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/db';
dotenv.config();
import authRoutes from './routes/auth.route';
import fileUpload from 'express-fileupload';
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload({
    useTempFiles:true,
	tempFileDir:"/tmp",
}))

app.get("/", (req, res) => {
    res.send("I am working fine!");
})

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
    await dbConnect();
    console.log(`Server is running at port ${PORT}`)
})