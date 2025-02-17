import controller from '../Controllers/controller.js';
import express from 'express';

const router = express.Router();

//current available filters: happy, sad, encouraging, random
router.get('/getFiltered/:filter', controller.getFiltered);

export default router;