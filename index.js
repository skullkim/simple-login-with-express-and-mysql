const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const cookie_parser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

const {sequelize} = require('./models');

const app = express();

dotenv.config();
app.set('port', process.env.PORT || 8080);
//nunjucks setting
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
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
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRETE,
    cookie: {
        httpOnly: true,
        secrue: false,
        maxAge: time.getMilliseconds + (1000 * 60),
    },
    name: 'session-cookie',
}));
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