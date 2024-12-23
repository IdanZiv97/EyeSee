import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from "./util/db.js"
// TODO: merge all routes to a folder and create index.js for general importing
import authRoutes from './routes/authRouter.js'
import storeRoutes from './routes/storeRouter.js'
import reportRoutes from './routes/reportsRouter.js'
import dashboardRoutes from './routes/dashboardRouter.js'
import mediaRoutes from './routes/mediaRouter.js'
import userRoutes from './routes/userRouter.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

connectDB();

app.use(storeRoutes);
app.use(authRoutes)
app.use(reportRoutes);
app.use(dashboardRoutes);
app.use(mediaRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("API is running")
});
console.log("Port: " + PORT);

app.listen(PORT, () => {
    console.log('Server is running on port: 4000'); 
});



