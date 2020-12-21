const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

const app = express();


app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});

const main_router = require('./routes');
const login_router = require('./routes/login');
const signup_router = require('./routes/signup');

app.use(express.static('public'));
app.use('/', main_router);
app.use('/login', login_router);
app.use('/signup', signup_router);
app.use('/check-signup', signup_router);

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