const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const cookie_parser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

const {sequelize} = require('./models');

const app = express();

//read .env file, parse the contents, assign it to process.env,
//and return an Object with a parsed key containing the loaded content
//or an error key if it failed.
dotenv.config();
app.set('port', process.env.PORT || 8080);
//nunjucks setting
app.set('view engine', 'html');
nunjucks.configure('views', {
    //ans express app that nunjucks should install to
    express: app,
    //reload templates when they are changed(server-side).
    //To use watch, make sure optional dependency chokidar is installed
    watch: true,
});

//connect sequelize to mysql DB
sequelize.sync({force: false})
    .then(() => {
        console.log('DB connect success');
    })
    .catch((err) => {
        console.error(err);
    });

const main_router = require('./routes');
const login_router = require('./routes/login');
const signup_router = require('./routes/signup');
const { time } = require('console');

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    //Forces the session to be saved back to the session store,
    //even if the session was never modified during the request
    resave: false,
    //Forces a sessino that it "uninitialized" to be saved to the store.
    //A session is uninitialized when it is new but not modified
    saveUninitialized: false,
    //The secrete used to sign the session ID cookie
    secret: process.env.COOKIE_SECRETE,
    cookie: {
        httpOnly: true,
        secrue: false,
        maxAge: time.getMilliseconds + (1000 * 60),
    },
    //The name of the session ID cookie to set in the response
    //ans read from in the request.
    name: 'session-cookie',
}));
//To server static files.
app.use(express.static('public'));
app.use('/', main_router);
app.use('/login', login_router);
app.use('/signup/', signup_router);

app.use((req, res, next) => {
    const error = new Error(`main ${req.method} ${req.url} router doesn't exit`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')} start server`);
})