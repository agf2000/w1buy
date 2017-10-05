const express = require("express");
const multer = require('multer');
// const uuid = require("uuid");
const fse = require('fs-extra');
const path = require('path');
const shortid = require('shortid');
const peopleController = require("../controllers/peopleController.js");
const postingController = require("../controllers/postingController.js");
const messageController = require("../controllers/messageController.js");
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
// const fs = require('fs');
const thumb = require('node-thumbnail').thumb;
// const fileMover = require('../public/javascripts/fileMover');
// const notifier = require('node-notifier');
// const growl = require('growl');

const router = express.Router();

let tempFolder = shortid.generate(),
    tempPath;

// vscode-fold=1

// File upload - start
let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            tempPath = path.join(__dirname, '..', 'data/uploads/' + req.body.ownerId + '/' + tempFolder);
            fse.mkdirsSync(tempPath);
            callback(null, tempPath);
        },
        filename: function (req, file, cb) {
            let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
            cb(null, shortid.generate() + '.' + ext);
        }
    })
});
// File upload - end

// vscode-fold=2

// General lists
router.get('/lists', function (req, res) {
    peopleController.getLists(req, res, req.query.listname, req.query.parentId, req.query.term, req.query.sortCol = 'Text', req.query.sortOrder = 'ASC');
});

router.get('/address', function (req, res) {
    peopleController.getAddress(req, res, req.query.postalCode);
});

// vscode-fold=3

// User Update Process
router.put('/updatePerson', ensureAuthenticated, function (req, res) {
    peopleController.updatePerson(req, res, req.body);
});

// vscode-fold=4

// Postings
// Posting insert
router.post('/addPosting', ensureAuthenticated, upload.array('images', 5), function (req, res, next) {
    if (req.files[0]) {
        postingController.addPosting(req, res, req.body, (req.files ? req.files : null), function (result) {
            if (!result.Error) {
                // Create posting folders
                let pathLarge = path.join(__dirname, '..', 'data/uploads/' + req.body.ownerId + '/posts/' + result.PostingId + '/large');
                let pathThumb = path.join(__dirname, '..', 'data/uploads/' + req.body.ownerId + '/posts/' + result.PostingId + '/thumbnail');
                fse.mkdirsSync(pathLarge);
                fse.mkdirsSync(pathThumb);

                thumb({
                    source: tempPath,
                    destination: pathThumb,
                    width: 160
                }).then(function (files, error, stdout, stderr) {
                    if (error) return console.error(error)

                    // Move files into posting folders                
                    fse.move(tempPath, pathLarge, {
                        overwrite: false
                    }, err => {
                        if (err) return console.error(err)

                        res.json({
                            PostingId: result.PostingId
                        })
                    });
                }).catch(function (e) {
                    console.log('Error', e.toString());
                });
            } else {
                res.json({
                    error: result.error
                });
            }
        });
    } else {
        postingController.addPosting(req, res, req.body, (req.files ? req.files : null), function (result) {
            if (!result.Error) {
                res.json({
                    PostingId: result.PostingId
                });
            } else {
                res.json({
                    error: result.error
                });
            }
        });
    }
});

// Posting update
router.put('/updatePosting', ensureAuthenticated, upload.array('images', 5), function (req, res, next) {
    if (req.files[0]) {
        thumb({
            source: '../data/uploads/' + req.body.userId + '/' + req.body.folder + '/' + req.body.folderId + '/large', // could be a filename: dest/path/image.jpg 
            destination: '../data/uploads/' + req.body.userId + '/' + req.body.folder + '/' + req.body.folderId + '/thumbnail',
            width: 160
        }).then(function (files, err, stdout, stderr) {
            postingController.updatePosting(req, res, req.body, (req.files ? req.files : null));
        }).catch(function (e) {
            console.log('Error', e.toString());
        });
    } else {
        postingController.updatePosting(req, res, req.body, (req.files ? req.files : null));
    }
});

// Get Postings
router.get('/getKeywords', function (req, res) {
    postingController.getKeywords(req, res, req.query.term)
});

// Get Postings locales
router.get('/getPostingsLocales', function (req, res) {
    postingController.getPostingsLocales(req, res, req.query.portalId || 0, req.query.term || "", req.query.localeId || "");
});

// Get Postings all  or by keywords
router.get('/getPostings', function (req, res) {
    postingController.getPostings(req, res, req.query.portalId || 0, req.query.term || "", req.query.localeId || "", req.query.pageIndex || 1, req.query.pageSize || 10);
});

// Get postings locales count by keywords or all
router.get('/getPostingsLocalesCount', function (req, res) {
    postingController.getPostingsLocalesCount(req, res, req.query.portalId || 0, req.query.term || "");
});

// Get User Postings
router.get('/getUserPostings', function (req, res) {
    postingController.getUserPostings(req, res, req.query.userId);
});

router.delete('/removePosting', function (req, res) {
    postingController.removePosting(req, res, req.query.postingId);
});

// Messages
// Gets users Messages
router.get('/getPostingsMessages', function (req, res, next) {
    messageController.getPostingsMessages(req, res, req.query.userId || 0);
});

// Gets Message comments
router.get('/getPostingMessageComments', function (req, res, next) {
    messageController.getPostingMessageComments(req, res, req.query.msgId, req.query.userId, req.query.postingId);
});

// Send posting msg
router.post('/sendPostingMessage', function (req, res) {
    messageController.sendPostingMessage(req, res, req.body);
});

router.post('/requestContact', function (req, res) {
    messageController.requestContact(req, res, req.body);
});

router.post('/sendContact', function (req, res) {
    messageController.sendContact(req, res, req.body);
});

// Add post message comment
router.post('/addPostingMessageComment', ensureAuthenticated, upload.array('files', 5), function (req, res, next) {
    if (req.files[0]) {
        let pathLarge = path.join(__dirname, '..', 'data/uploads/' + req.body.ownerId + '/' + req.body.folder + '/' + req.body.folderId + '/large/');
        let pathThumb = path.join(__dirname, '..', 'data/uploads/' + req.body.ownerId + '/' + req.body.folder + '/' + req.body.folderId + '/thumbnail/');
        fse.mkdirsSync(pathLarge);
        fse.mkdirsSync(pathThumb);

        thumb({
            source: tempPath,
            destination: pathThumb,
            width: 160
        }).then(function (files, error, stdout, stderr) {
            if (error) return console.error(error)

            // Move files into posting folders                
            fse.move(tempPath, pathLarge, {
                overwrite: false
            }, err => {
                if (err) return console.error(err)

                messageController.addPostingMessageComment(req, res, req.body, (req.files ? req.files : null));
            });
        }).catch(function (e) {
            console.log('Error', e.toString());
        });
    } else {
        messageController.addPostingMessageComment(req, res, req.body, (req.files ? req.files : null));
    }
});

router.post('/purchase', function (req, res) {
    messageController.purchase(req, res, req.body);
});

router.delete('/removeMsg', function (req, res) {
    messageController.removeMsg(req, res, req.body);
});

router.post('/saveReputation', function (req, res) {
    peopleController.saveReputation(req, res, req.body);
});

// Posting update
// router.put('/updatePosting', ensureAuthenticated, multer({
//     destination: (req, file, callback) => {
//         let path = '../data/uploads/' + req.body.userId + '/' + req.body.postingId;
//         fse.mkdirsSync(path);
//         callback(null, path);
//     },
//     filename: function (req, file, cb) {
//         let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
//         cb(null, shortid.generate() + '.' + ext);
//     }
// }).array('images', 5), function (req, res, next) {
//     if (req.files[0]) {
//         thumb({
//             source: '../data/uploads/' + req.body.userId + '/' + req.body.postingId, // could be a filename: dest/path/image.jpg 
//             destination: '../data/uploads/' + req.body.userId + '/' + req.body.postingId,
//             width: 120
//         }).then(function (files, err, stdout, stderr) {
//             postingController.updatePosting(req, res, req.body, (req.files ? req.files : null));
//         }).catch(function (e) {
//             console.log('Error', e.toString());
//         });
//     } else {
//         postingController.updatePosting(req, res, req.body, (req.files ? req.files : null));
//     }
// });

module.exports = router;