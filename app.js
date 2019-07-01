const express = require('express');
const bodyParser = require('body-parser');

const shopRoutes = require('./routes/shop');
const app = express();


/*--------MIDDLEWARES----------*/

app.use(bodyParser.json()); //application/json

app.use((req, res, next) => {
    res.setHeader('Acces-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/', shopRoutes)

app.listen(8000);