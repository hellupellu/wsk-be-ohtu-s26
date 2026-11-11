import express from 'express';
import router from './api/index.js';
import {notFoundHandler, errorHandler} from './middlewares/error-handlers.js';

const app = express();

app.use(express.static('public'));
// app.use('/images', express.static('public'));

// needed for reading request body in JSON format
app.use(express.json());

// Ohjataan kaikki /api/v1/-alkuiset pyynnöt apin router middlewarelle (api/index.js)
app.use('/api/v1', router);

// Default for all routes not handled by routers above
app.use(notFoundHandler);
// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);

export default app;
