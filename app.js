const express = require('express');
const bodyParser = require('body-parser');


const app = express();


/*--------MIDDLEWARES----------*/

app.use(bodyParser.json()); //application/json

app.listen(8000);