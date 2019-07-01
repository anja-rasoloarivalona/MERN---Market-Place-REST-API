const express = require('express');
const bodyParser = require('body-parser');

const shopRoutes = require('./routes/shop');
const app = express();


/*--------MIDDLEWARES----------*/

app.use(bodyParser.json()); //application/json

app.use('/', shopRoutes)

app.listen(8000);