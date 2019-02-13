require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");
    

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
      throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined ) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
});

hbs.registerHelper('formatDate', (value, options) => {
  try {
    return value.toISOString().substr(0,16)
  }
  catch (err) {
    return "formatDate had a problem..."
  }
  // if (arguments.length < 2)
  //     throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  // if (typeof value !== undefined ) {
  //     return options.inverse(this);
  // } else {
  //     return options.fn(this);
  // }
});
hbs.registerHelper('formatDateProfile', (value, options) => {
  try {
    return value.toISOString().substr(0,10)
  }
  catch (err) {
    return "formatDate had a problem..."
  }
  
});
  
hbs.registerHelper('formatDateProfile', (value, options) => {
  try {
    return value.toISOString().substr(0,10)
  }
  catch (err) {
    return "formatDate had a problem..."
  }
  
});
//test

hbs.registerHelper('formatDateEvents', (value, options) => {
  try {
    return value.toString().substr(0,21) 
  }
  catch (err) {
    return ""
  }
  
});
  

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
app.use(flash());
require('./passport')(app);
    

app.use((req, res, next)=> {
 
  res.locals.user = req.user;
  next();
});


const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
      

module.exports = app;
