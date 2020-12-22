const express = require('express');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

router.use(express.urlencoded({extended: true}));

router.get('/', (req, res, next) => {
    try{
        res.sendFile(path.join(__dirname, '../views/signup.html'));
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/check-signup', async (req, res, next) => {
    try{
        const user = await User.findOne({
            where: {name: req.body.id}
        });
        if(!user && req.body.passwd1 === req.body.passwd2){
            const user = await User.create({
                name: req.body.id,
                passwd: req.body.passwd1,
            });
            res.render('check_signup', {success_signup: 'success'});
        }
        else{
            if(user && req.body.passwd1 === req.body.passwd2){
                res.render('check_signup', {success_signup: 'wrongId'});
            }
            else{
                res.render('check_signup', {success_signup: 'wrongPasswd'});
            }
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
})
module.exports = router;