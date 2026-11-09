import express from 'express';
import router from './api/index.js';

const app = express();

app.use(express.static('public'));
// app.use('/images', express.static('public'));

// needed for reading request body in JSON format
app.use(express.json());

// Ohjataan kaikki /api/v1/-alkuiset pyynnöt apin router middlewarelle (api/index.js)
app.use('/api/v1', router);

export default app;
