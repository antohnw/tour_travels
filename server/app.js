const express = require('express');
const cors = require('cors');

const routes = require('./routes/index');

const app = express();

require('dotenv').config();
//Middleware
app.use(express.json());
app.use(cors()); // Allows all origins

//Error Handling
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
    console.log('Server Started on port ${PORT}');
})