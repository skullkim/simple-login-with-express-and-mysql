const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.urlencoded({extended: true}));

router.post('/', (req, res, next) => {
    try{
        //res.sendFile(path.join(__dirname, '../views/login.html'));
        res.render('login', {'name': req.body.id});
    }
    catch(err){
        console.log(err);
        next(err);
    }
})


module.exports = router;