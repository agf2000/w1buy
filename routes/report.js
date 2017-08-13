const express = require('express');
const router = express.Router();
const postingController = require("../controllers/postingController.js");
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
const request = require('request');

// Reports
// Postings
router.get('/posts', function (req, res) {

    postingController.getPosts(req, res, 0, function (records) {
        if (!records.error) {

            records.forEach(function(element) {
                element.Locales = JSON.parse(element.Locales.replace(/\,(?!\s*[\{\[\"\'\w])/g, ''));
            }, this);

            let data = {
                template: {
                    'shortid': 'SyPs21Twb',
                },
                data: records,
                options: {
                    preview: true
                }
            };

            let options = {
                uri: 'http://localhost:5488/api/report',
                method: 'POST',
                json: data
            };

            request(options).pipe(res);

        } else {
            res.json(records);
        }
    });
});

module.exports = router;