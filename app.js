const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const app = express();
const helmet = require('helmet');
const compression = require('compression');



/*----------ROUTES----------------*/
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

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


app.use(helmet());
app.use(compression());

app.use('*', cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json()); //application/json
app.use(
    multer({storage: storage, fileFilter: fileFilter}).single('image')
)
app.use('/images', express.static(path.join(__dirname, 'images')));




app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)
app.use('/', shopRoutes)

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
//    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-wijrw.mongodb.net/shop`)
    .connect(`mongodb+srv://anja:anjanirina@cluster0-wijrw.mongodb.net/shop`)
    .then(result =>{
        console.log('connected')
        app.listen(process.env.PORT || 8000)
    })
    .catch(err => 
        console.log(err)
   );