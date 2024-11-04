import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from "./util/db.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("API is running")
});
console.log("Port: " + PORT);

app.listen(PORT, () => {
    console.log('Server is running on port: 4000'); 
});



