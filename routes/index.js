var express = require('express');
var router = express.Router();

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    return res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', isLoggedIn, function(req, res, next) {
  res.render('login', {message: req.flash('message')});
});


module.exports = router;
