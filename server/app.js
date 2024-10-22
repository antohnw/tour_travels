import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv for environment variables
import routes from './routes/index.js'; // Ensure the path ends with .js

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows all origins

// Error Handling
app.use((err, req, res, next) => {
    if (err.statusCode) {
        res.status(err.statusCode).send(err.message);
    } else {
        console.log(err);
        res.status(500).send('Something unexpected happened');
    }
});

// Import routes
app.use(routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`); // Use template literals correctly
});

export default app; 
