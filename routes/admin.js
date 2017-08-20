const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
const postingController = require("../controllers/postingController.js");
const peopleController = require("../controllers/peopleController.js");

// Home
router.get('/', ensureAuthenticated, function (req, res) {
    res.render('./admin/home', {
        title: 'W1Buy :: Admin',
        layout: 'admin',
        user: req.user,
        css: [
            '/stylesheets/admin.css'
        ],
        script: [
            '/javascripts/utilities.js',
            '/javascripts/account.js',
            '/javascripts/admin.js'
        ]
    });
});

// Reports
// Postings
router.get('/anuncios', ensureAuthenticated, function (req, res) {
    res.render('./admin/posts', {
        title: 'Admin :: Anúncios',
        layout: 'admin',
        user: req.user,
        css: [
            '/stylesheets/admin.css'
        ],
        script: [
            '/javascripts/utilities.js',
            '/javascripts/account.js',
            '/javascripts/adminposts.js'
        ]
    });
});

// Users page
router.get('/usuarios', ensureAuthenticated, function (req, res) {
    res.render('./admin/users', {
        title: 'Admin :: Usuários',
        layout: 'admin',
        user: req.user,
        css: [
            '/lib/select2/css/select2.min.css',
            '/lib/select2-bootstrap-theme/css/select2-bootstrap.min.css',
            '/stylesheets/admin.css'
        ],
        script: [
            '/lib/select2/js/select2.min.js',
            '/lib/select2/i18n/pt-BR.js',
            '/lib/jquery-mask/js/jquery.mask.min.js',
            '/javascripts/utilities.js',
            '/javascripts/account.js',
            '/javascripts/adminusers.js'
        ]
    });
});

// Posts data
router.get('/getPosts', ensureAuthenticated, function (req, res) {
    postingController.getPosts(req, res, 0, function (records) {
        if (!records.error) {
            res.json({
                "postings": records,
                "total": records.length
            });
        }
    });
});

// Users data
router.get('/getPeople', ensureAuthenticated, function (req, res) {
    peopleController.getPeople(req, res, 0, function (records) {
        if (!records.error) {
            res.json({
                "users": records,
                "total": records.length
            });
        }
    });
});

// People date statistics
router.get('/getPeopleDate', ensureAuthenticated, function (req, res) {
    peopleController.getPeopleDate(req, res, req.query.year, function (records) {
        if (!records.error) {
            res.json(records);
        }
    });
});

// Posting date statistcis
router.get('/getPostingsDate', ensureAuthenticated, function (req, res) {
    postingController.getPostingsDate(req, res, req.query.year || '2017', function (records) {
        if (!records.error) {
            res.json(records);
        }
    });
});

// People locale statistics 
router.get('/getPeopleLocales', ensureAuthenticated, function (req, res) {
    peopleController.getPeopleLocales(req, res, req.query.year, function (records) {
        if (!records.error) {
            res.json(records);
        }
    });
});

// Posting locale statistcis
router.get('/getPostingsLocales', ensureAuthenticated, function (req, res) {
    postingController.getPostingsLocales(req, res, req.query.year || '2017', function (records) {
        if (!records.error) {
            res.json(records);
        }
    });
});

module.exports = router;