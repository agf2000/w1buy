const express = require('express');
const router = express.Router();
const postingController = require("../controllers/postingController.js");
const ensureAuthenticated = require('../process/js/ensureAuthenticated');

// vscode-fold=1
// Postings list (search)
router.get('/', ensureAuthenticated, function (req, res) {
    res.render('postings', {
        title: 'W1Buy :: Anúncios',
        user: req.user,
        css: [
            '/lib/rateyo/css/jquery.rateyo.min.css',
            '/stylesheets/postings.css'
        ],
        script: [
            '/lib/rateyo/js/jquery.rateyo.min.js',
            '/lib/knockout/knockout-latest.js',
            '/lib/corejs-typeahead/typeahead.bundle.min.js',
            '/lib/jquery-touchswipe/jquery.touchSwipe.min.js',
            '/javascripts/utilities.js',
            '/javascripts/postingsViewModel.js',
            '/javascripts/postings.js',
            '/javascripts/account.js'
        ]
    });
});

// User postings
router.get('/meusanuncios', ensureAuthenticated, function (req, res) {
    res.render('myPostings', {
        title: 'W1Buy :: Meus Anúncios',
        user: req.user,
        css: [
            '/stylesheets/myPostings.css'
        ],
        script: [
            '/javascripts/myPostings.js'
        ]
    });
});

// Posting form new
router.get('/novo', ensureAuthenticated, function (req, res) {
    res.render('postingForm', {
        title: 'W1Buy :: Cadastro de Anúncio',
        user: req.user,
        css: [
            '/lib/bootstrap-fileinput/css/fileinput.min.css',
            '/lib/pnotify/css/pnotify.css',
            '/lib/pnotify/css/pnotify.buttons.css',
            '/lib/bootstrap-tagsinput/css/bootstrap-tagsinput.css',
            '/lib/bootstrap3-dialog/css/bootstrap-dialog.min.css',
            '/lib/select2/css/select2.min.css',
            '/lib/select2-bootstrap-theme/css/select2-bootstrap.min.css',
            // '/lib/pickadate/themes/default.css',
            // '/lib/pickadate/themes/default.date.css',
            // '/lib/pickadate/themes/default.time.css',
            // '/lib/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
            '/lib/pikaday/css/pikaday.css',
            // '/stylesheets/account.css',
            '/stylesheets/postingForm.css'
        ],
        script: [
            '/lib/bootstrap-fileinput/js/fileinput.min.js',
            '/lib/bootstrap-fileinput/js/locales/pt-br.js',
            '/lib/pnotify/js/pnotify.js',
            '/lib/pnotify/js/pnotify.buttons.js',
            '/lib/pnotify/js/pnotify.callbacks.js',
            '/lib/pnotify/js/pnotify.confirm.js',
            '/lib/pnotify/js/pnotify.mobile.js',
            '/lib/bootstrap-tagsinput/js/bootstrap-tagsinput.min.js',
            '/lib/bootstrap3-dialog/js/bootstrap-dialog.min.js',
            '/lib/select2/js/select2.min.js',
            '/lib/select2/i18n/pt-BR.js',
            // '/lib/pickadate/js/picker.js',
            // '/lib/pickadate/js/picker.date.js',
            // '/lib/pickadate/js/picker.time.js',
            // '/lib/pickadate/js/translations/pt_BR.js',
            // '/lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
            // '/lib/bootstrap-datepicker/locales/bootstrap-datepicker.pt-BR.min.js',
            '/lib/pikaday/js/pikaday.js',
            '/javascripts/utilities.js',
            '/javascripts/account.js',
            '/javascripts/postingForm.js'
        ]
    });
});

// Posting form edit
router.get('/editar/:id/:userId', ensureAuthenticated, function (req, res) {
    postingController.getPost(req, res, req.params.id, req.params.userId, function (data) {
        if (!data.error) {
            res.render('postingForm', {
                title: 'W1Buy :: Cadastro de Anúncio',
                user: req.user,
                data: data[0],
                css: [
                    '/lib/bootstrap-fileinput/css/fileinput.min.css',
                    '/lib/pnotify/css/pnotify.css',
                    '/lib/pnotify/css/pnotify.buttons.css',
                    '/lib/bootstrap-tagsinput/css/bootstrap-tagsinput.css',
                    '/lib/bootstrap3-dialog/css/bootstrap-dialog.min.css',
                    '/lib/select2/css/select2.min.css',
                    '/lib/select2-bootstrap-theme/css/select2-bootstrap.min.css',
                    // '/lib/pickadate/themes/default.css',
                    // '/lib/pickadate/themes/default.date.css',
                    // '/lib/pickadate/themes/default.time.css',
                    // '/lib/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                    '/lib/pikaday/css/pikaday.css',
                    // '/stylesheets/account.css',
                    '/stylesheets/postingForm.css'
                ],
                script: [
                    '/lib/bootstrap-fileinput/js/fileinput.min.js',
                    '/lib/bootstrap-fileinput/js/locales/pt-br.js',
                    '/lib/pnotify/js/pnotify.js',
                    '/lib/pnotify/js/pnotify.buttons.js',
                    '/lib/pnotify/js/pnotify.callbacks.js',
                    '/lib/pnotify/js/pnotify.confirm.js',
                    '/lib/pnotify/js/pnotify.mobile.js',
                    '/lib/bootstrap-tagsinput/js/bootstrap-tagsinput.min.js',
                    '/lib/bootstrap3-dialog/js/bootstrap-dialog.min.js',
                    '/lib/select2/js/select2.min.js',
                    '/lib/select2/i18n/pt-BR.js',
                    // '/lib/pickadate/js/picker.js',
                    // '/lib/pickadate/js/picker.date.js',
                    // '/lib/pickadate/js/picker.time.js',
                    // '/lib/pickadate/js/translations/pt_BR.js',
                    // '/lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                    // '/lib/bootstrap-datepicker/locales/bootstrap-datepicker.pt-BR.min.js',
                    '/lib/pikaday/js/pikaday.js',
                    '/javascripts/utilities.js',
                    '/javascripts/account.js',
                    '/javascripts/postingForm.js'
                ]
            });
        } else {
            res.json(data);
        }
    });
});

// Post
router.get('/:id/:userId', ensureAuthenticated, function (req, res, next) {
    postingController.getPost(req, res, req.params.id, req.params.userId, function (data) {
        if (!data.error) {
            res.render('post', {
                title: 'W1Buy :: Anúncio: Compro ' + data[0].Title.replace('Compro', ' '),
                user: req.user,
                data: data[0],
                css: [
                    '/lib/rateyo/css/jquery.rateyo.min.css',
                    '/stylesheets/post.css',
                    // '/stylesheets/account.css'
                ],
                script: [
                    '/lib/rateyo/js/jquery.rateyo.min.js',
                    '/lib/jquery-touchswipe/jquery.touchSwipe.min.js',
                    '/javascripts/utilities.js',
                    '/javascripts/account.js',
                    '/javascripts/post.js'
                ]
            });
        } else {
            res.json(data);
        }
    });
});

module.exports = router;