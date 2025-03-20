import express from 'express';
import cors from 'cors'
import router from './Routers/router.js'

const app = express();

//enable cors
app.use(cors());

app.use(express.json());

//enable static files
app.use('/Files', express.static('Files'));

//hello API endpoint
app.get('/hello', (req, res) => {
    res.json({message: 'Hello test test from the backend API /hello'})
});

//routes for proessing server requests
app.use('/', router);

//express listening port
const PORT = 3000;
app.listen(PORT,()=> {
    console.log(`Server started on ${PORT}`)
});