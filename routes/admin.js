const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
const postingController = require("../controllers/postingController.js");

// Reports
// Postings
router.get('/postreport', ensureAuthenticated, function (req, res) {
    res.render('./admin/postreport', {
        title: 'Admin :: Anúncios',
        layout: 'admin',
        user: req.user,
        css: [
            '/stylesheets/postreport.css'
        ],
        script: [
            '/javascripts/utilities.js',
            '/javascripts/postreport.js'
        ]
    });
});

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

module.exports = router;