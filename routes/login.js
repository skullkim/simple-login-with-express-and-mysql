const express = require('express');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

router.use(express.urlencoded({extended: true}));

router.post('/', async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {name: req.body.id}
        });
        if(user){
            if(!req.session.user){
                req.session.user = {
                    name: req.body.id,
                    passwd: req.body.passed,
                    authorized: true,
                }
            }
            res.render('login', {'name': req.body.id, has_user: true});
        }
        else{
            res.render('login', {has_user: false});
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

router.post('/signout', (req, res, next) => {
    req.session.destroy(() => req.session);
    res.redirect('/');
});

module.exports = router;