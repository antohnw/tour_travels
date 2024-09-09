const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use((err, req, res, next) => {
    if (err.statusCode) {
        res.status(err.statusCode).send(err.message);
    } else {
        console.log(err);
        res.status(500).send('Something unexpected happened');
    }
});
const PORT = process.env.PORT || 8083;
const usersRoute = require('./routes/users');
app.use(usersRoute);

app.listen(PORT, () => {
    console.log('Server Started');
})