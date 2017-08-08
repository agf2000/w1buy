const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {
        title: 'W1Buy :: Home',
        layout: false,
        user: req.user,
        css: [
            '/stylesheets/home.css',
            '/stylesheets/login.css'
        ],
        script: [
            '/lib/jquery-touchswipe/jquery.touchSwipe.min.js',
            '/javascripts/utilities.js',
            '/javascripts/login.js',
            '/javascripts/home.js'
        ]
    });
});

/* GET plans page. */
router.get('/planos', function (req, res, next) {
    res.render('plans', {
        title: 'W1Buy :: Ajuda',
        user: req.user,
        // css: [
        //     '/stylesheets/home.css'
        // ],
        // script: [
        //     '/javascripts/home.js'
        // ]
    });
});

/* GET plans page. */
router.get('/termos', function (req, res, next) {
    res.render('terms', {
        title: 'W1Buy :: Termos de Uso',
        layout: 'neutral',
        user: req.user
    });
});

/* GET plans page. */
router.get('/privacidade', function (req, res, next) {
    res.render('privacy', {
        title: 'W1Buy :: Política de Privacidade',
        layout: 'neutral',
        user: req.user
    });
});

module.exports = router;