const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const app = express();



/*----------ROUTES----------------*/
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});



const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };


/*--------MIDDLEWARES----------*/


app.use('*', cors())


app.use(bodyParser.json()); //application/json
app.use(
    multer({storage: storage, fileFilter: fileFilter}).single('image')
)
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/admin', adminRoutes)
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