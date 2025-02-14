import express from 'express';
import cors from 'cors'

const app = express();

//enable cors
app.use(cors());
app.use(express.json());

//hello API endpoint
app.get('/hello', (req, res) => {
    res.json({message: 'Hello test test from the backend API /hello'})
})

//express listening port
const PORT = 3000;
app.listen(PORT,()=> {
    console.log(`Server started on ${PORT}`)
})