const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const shopRoutes = require('./routes/shop');
const app = express();


/*--------MIDDLEWARES----------*/


app.use('*', cors())


app.use(bodyParser.json()); //application/json

app.use('/', shopRoutes)


mongoose
    .connect('mongodb+srv://anja:anjanirina@cluster0-wijrw.mongodb.net/shop')
    .then(result =>{
        console.log('connected')
        app.listen(8000)
    })
    .catch(err => 
        console.log(err)
    )
;