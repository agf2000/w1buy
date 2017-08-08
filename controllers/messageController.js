const db = require("../core/db");
const util = require("util");
const _ = require('lodash');
const emailServer = require('../config/emailConfig');

// Sends post message
// vscode-fold=1
exports.sendPostingMessage = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = util.format("declare @id int, @toUser nvarchar(100), @fromUser nvarchar(100); " +
                "insert into w1buy_postingmessages (portalid, touserid, fromuserid, msg, postingid, [subject], commentscount, newmessage, createdondate, modifiedondate, show" +
                ", priorityvalueamount, prioritydeliveryamount, createdbyuser) values (%d, %d, %d, '%s', %d, '%s', 1, 1, getdate(), getdate(), 'false', %d, %d, %d); set @id = scope_identity(); ",
                data.portalId, data.toUserId, data.fromUserId, data.msg, data.postingId, data.subject, data.priorityValueAmount, data.priorityDeliveryAmount, data.fromUserId);

            sqlInst += util.format("set @toUser = (select displayname from users where userid = %d); ", data.toUserId);
            sqlInst += util.format("set @fromUser = (select displayname from users where userid = %d); ", data.fromUserId);

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate, show)";
            sqlInst += util.format(" values (@id, (select displayname from users where userid = %d) + ': ' + '%s', %d, %d, %d, getdate(), 1); ",
                data.fromUserId, data.msg, data.postingId, data.toUserId, data.fromUserId);

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate, show)";
            sqlInst += util.format(" values (@id, (select displayname from users where userid = %d) + ': ' + '%s', %d, %d, %d, getdate(), 1); ",
                data.fromUserId, data.msg, data.postingId, data.fromUserId, data.toUserId);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, " +
                "[context], includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate()); ",
                data.portalId, data.subject, data.msg, data.postingId, data.fromUserId, data.toUserId, data.fromUserId);

            sqlInst += `select email, firstname, lastname from users where userid = ${data.toUserId}; `;

            db.querySql(sqlInst, function (records, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {

                    if (data.toUserId !== "2") {
                        if (data.toUserId !== data.fromUserId) {
                            if (res.app.locals.loggedInUsers[data.toUserId]) {
                                res.app.locals.loggedInUsers[data.toUserId].emit('usernames', 1);
                            }                            
                        }
                    }

                    if (records.recordsets[0]) {
                        let email = records.recordsets[0][0].email,
                            firstname = records.recordsets[0][0].firstname,
                            lastname = records.recordsets[0][0].lastname;

                        let emailText = `Caro(a) ${firstname} ${lastname}, há nova(s) mensagem(ns) sobre seu anúncio. \n\n
                                Endereço do Portal: ${req.headers.origin} \n
                                Seu login: ${email} \n\n
                                Obrigado!`;

                        // send the message and get a callback with an error or details of the message that was sent 
                        emailServer.send({
                            text: emailText,
                            from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                            to: '"' + firstname + ' ' + lastname + '" <' + email + '>',
                            subject: 'Nova(s) mensagem(ns) no portal W1Buy'
                        }, function (error, message) {
                            console.log(error || message);
                        });
                    }

                    res.json({
                        "success": "success"
                    });
                }
            }, true);
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.send(ex);
    };
};

// Gets posts messages from userid
// vscode-fold=2
exports.getPostingsMessages = function (req, res, userId) {
    try {
        if (userId) {
            let sqlInst = "select pm.*, FromUser = u.displayname, Sender = u2.displayname";
            sqlInst += ", (select value from lists where entryid = (select regionid from users where userid = pm.createdbyuser)) as SenderRegion";
            sqlInst += ", (select value from lists where entryid = (select cityid from users where userid = pm.createdbyuser))  as SenderCity";
            sqlInst += ", (select value from lists where entryid = (select regionid from users where userid = pm.touserid)) as FromRegion";
            sqlInst += ", (select value from lists where entryid = (select cityid from users where userid = pm.touserid))  as FromCity";
            sqlInst += ", p.UserId, p.BuyerPaid, p.SellerPaid, p.Condition, p.[Complete]";
            sqlInst += ", isnull((select avg(vote) from w1buy_user_reputation where touserid = pm.fromuserid), 5) as Rating ";
            sqlInst += "from w1buy_postingmessages pm ";
            sqlInst += "join users u on pm.fromuserid = u.userid ";
            sqlInst += "join users u2 on pm.touserid = u2.userid ";
            sqlInst += "join w1buy_postings p on pm.postingid = p.postingid ";
            sqlInst += `where (pm.touserid = ${userId} or pm.fromuserid = ${userId}) and (select count(*) from w1buy_postingmessagecomments where msgid = pm.msgid) > 1 `;
            sqlInst += "order by modifiedondate desc; ";

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    // if (data.recordsets[1].length) {
                    //     data.recordsets[0][0].Comments = data.recordsets[1];
                    // }
                    // if (data.recordsets[1].length) {
                    //     data.recordsets[0][0].Files = data.recordsets[2];
                    // }

                    res.json(data.recordsets[0]);
                }
            }, true);
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.json(ex.message);
    }
};

// Gets post message comments
// vscode-fold=3
exports.getPostingMessageComments = function (req, res, msgId, userId, postingId) {
    try {
        if (msgId !== '') {
            let sqlInst = `delete from notifications where conversationid = ${postingId} and [Context] = ${userId}; `;
            sqlInst += `update w1buy_postingmessages set newmessage = 0 where msgid = ${msgId} and touserid = ${userId}; `;

            sqlInst += "select c.*, FromUser = (select displayname from users where userid = c.fromuserid) ";
            sqlInst += ", (select value from lists where entryid = (select regionid from users where userid = c.fromuserid)) as SenderRegion";
            sqlInst += ", (select value from lists where entryid = (select cityid from users where userid = c.fromuserid)) as SenderCity ";
            sqlInst += "from w1buy_postingmessagecomments c where c.msgid = " + msgId + " and c.touserid = " + userId;
            sqlInst += " order by c.commentid desc; ";

            sqlInst += `select * from w1buy_postingfiles where conversationid = ${msgId} order by createdondate desc; `;

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    // if (data.recordsets[1].length) {
                    //     data.recordsets[0][0].Comments = data.recordsets[1];
                    // }
                    if (data.recordsets[1].length) {
                        data.recordsets[0][0].Files = data.recordsets[1];
                    }

                    res.json(data.recordsets[0]);
                }
            }, true);
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.json(ex.message);
    }
};

// Adds comment to message
// vscode-fold=4
exports.addPostingMessageComment = function (req, res, reqBody, files) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int, @toUser nvarchar(100), @fromUser nvarchar(100); "
            sqlInst += `update w1buy_postingmessages set newmessage = 0, commentscount = (isnull(commentscount, 0) + 1), show = 1, modifiedondate = getdate(), 
            fromuserid = ${data.fromUserId}, touserid = ${data.toUserId} where msgid = ${data.msgId}; `;
            sqlInst += `update w1buy_postingmessages set newmessage = (case when fromuserid = ${data.fromUserId} then 1 else 0 end), commentscount = (commentscount + 1), 
            show = 1, modifiedondate = getdate() where touserid = ${data.toUserId} and postingid = ${data.postingId}; `;

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate, show)";
            sqlInst += util.format(" values (%d, (select displayname from users where userid = %d) + ': ' + '%s', %d, %d, %d, getdate(), 1); ",
                data.msgId, data.fromUserId, data.commentText, data.postingId, data.toUserId, data.fromUserId);

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate, show)";
            sqlInst += util.format(" values (%d, (select displayname from users where userid = %d) + ': ' + '%s', %d, %d, %d, getdate(), 1); set @id = scope_identity(); ",
                data.msgId, data.fromUserId, data.commentText, data.postingId, data.fromUserId, data.fromUserId);

            if (files) {
                _.forEach(files, function (file) {
                    sqlInst += util.format("insert into w1buy_PostingFiles (portalid, conversationid, [filename], originalname, size, contenttype, imageurl, touserid, fromuserid, createdondate) " +
                        "values (%d, %d, '%s', '%s', %d, '%s', '%s', %d, %d, getdate()); ",
                        data.portalId, data.msgId, file.filename, file.originalname, file.size, file.mimetype, file.path, data.toUserId, data.fromUserId);
                });
            }

            sqlInst += util.format("set @toUser = (select displayname from users where userid = %d); ", data.toUserId);
            sqlInst += util.format("set @fromUser = (select displayname from users where userid = %d); ", data.fromUserId);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, " +
                "[context], includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate());",
                data.portalId, data.subject, data.commentText, data.postingId, data.fromUserId, data.toUserId, data.fromUserId);

            sqlInst += "select @id as CommentId; ";

            sqlInst += `select email, firstname, lastname from users where userid = ${data.toUserId}; `;

            db.querySql(sqlInst, function (records, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    // if (records.recordsets[1]) {
                    //     records.recordset[0].Files = records.recordsets[1];
                    // }
                    // res.json(records.recordset[0]);

                    if (data.toUserId !== "2") {
                        if (res.app.locals.loggedInUsers[data.toUserId]) {
                            res.app.locals.loggedInUsers[data.toUserId].emit('usernames', 1);
                        }
                    }

                    if (records.recordsets[1]) {
                        let email = records.recordsets[1][0].email,
                            firstname = records.recordsets[1][0].firstname,
                            lastname = records.recordsets[1][0].lastname;
                        
                        let emailText = `Caro(a) ${firstname} ${lastname}, há nova(s) mensagem(ns) sobre seu anúncio. \n\n
                                Endereço do Portal: ${req.headers.origin} \n
                                Seu login: ${email} \n\n
                                Obrigado!`;

                        // send the message and get a callback with an error or details of the message that was sent 
                        emailServer.send({
                            text: emailText,
                            from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                            to: '"' + firstname + ' ' + lastname + '" <' + email + '>',
                            subject: 'Nova(s) mensagem(ns) no portal W1Buy'
                        }, function (error, message) {
                            console.log(error || message);
                        });
                    }

                    res.json(records.recordset[0].CommentId)
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.send(ex);
    };
};

// Request contact
// vscode-fold=5
exports.requestContact = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int, @toUser nvarchar(100), @fromUser nvarchar(100); "
            sqlInst += `update w1buy_postingmessages set commentscount = (isnull(commentscount, 0) + 1), modifiedondate = getdate(), 
                touserid = ${data.toUserId}, fromuserid = ${data.fromUserId} where msgid = ${data.msgId}; `;

            sqlInst += `update w1buy_postingmessages set newmessage = (case when fromuserid = ${data.fromUserId} then 1 else 0 end), commentscount = (commentscount + 1), modifiedondate = getdate(), 
            touserid = ${data.fromUserId}, fromuserid = ${data.toUserId} where touserid = ${data.toUserId} and postingid = ${data.postingId}; `;

            sqlInst += `update w1buy_postings set buyerpaid = 1, modifiedondate = getdate() where postingid = ${data.postingId}; `;

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate)";
            sqlInst += util.format(" values (%d, '%s', %d, %d, %d, getdate()); set @id = scope_identity(); ",
                data.msgId, 'W1Buy (Administração): Pedido de contato enviado. Por favor aguarde!', data.postingId, data.fromUserId, data.fromUserId);

            let commentText = 'W1Buy (Administração): ParabParabéns, você negociou bem. Seu comprador deseja entrar em contato com você. Agora está na hora de finalizar sua venda, Clique no botão [Enviar Contato].';
            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate)";
            sqlInst += util.format(" values (%d, '%s', %d, %d, %d, getdate()); ",
                data.msgId, commentText, data.postingId, data.toUserId, data.fromUserId);

            sqlInst += util.format("set @toUser = (select displayname from users where userid = %d); ", data.toUserId);
            sqlInst += util.format("set @fromUser = (select displayname from users where userid = %d); ", data.fromUserId);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, [context]," +
                " includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate()); ",
                data.portalId, data.subject, commentText, data.postingId, data.fromUserId, data.toUserId, data.createdByUser);

            sqlInst += `select email, firstname, lastname from users where userid = ${data.toUserId}; `;

            db.querySql(sqlInst, function (records, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    if (data.toUserId !== "2") {
                        if (res.app.locals.loggedInUsers[data.toUserId]) {
                            res.app.locals.loggedInUsers[data.toUserId].emit('usernames', 1);
                        }
                    }

                    if (records.recordsets[0]) {
                        let email = records.recordsets[0][0].email,
                            firstname = records.recordsets[0][0].firstname,
                            lastname = records.recordsets[0][0].lastname;

                        let emailText = `Caro(a) ${firstname} ${lastname}, há nova(s) mensagem(ns) sobre seu anúncio. \n\n
                                Endereço do Portal: ${req.headers.origin} \n
                                Seu login: ${email} \n\n
                                Obrigado!`;
                        
                        // send the message and get a callback with an error or details of the message that was sent 
                        emailServer.send({
                            text: emailText,
                            from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                            to: '"' + firstname + ' ' + lastname + '" <' + email + '>',
                            subject: 'Nova(s) mensagem(ns) no portal W1Buy'
                        }, function (error, message) {
                            console.log(error || message);
                        });
                    }

                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.json(ex.message);
    }
};

// Request contact
// vscode-fold=6
exports.sendContact = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int, @toUser nvarchar(100), @fromUser nvarchar(100); "
            sqlInst += `update w1buy_postingmessages set commentscount = (isnull(commentscount, 0) + 1), modifiedondate = getdate() where msgid = ${data.msgId}; `;

            sqlInst += `update w1buy_postingmessages set newmessage = (case when touserid = ${data.toUserId} then 1 else 0 end), commentscount = (commentscount + 1) 
                , modifiedondate = getdate() where touserid = ${data.toUserId} and postingid = ${data.postingId}; `;

            sqlInst += `update w1buy_postings set sellerpaid = ${data.fromUserId}, modifiedondate = getdate() where postingid = ${data.postingId}; `;

            let contactInfo = 'W1Buy (Administração): Pedido de visualização de contato aprovado. Favor clicar no botão [Concluir Negociação] para concluir e visualizar o contato da outra parte.';

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate";
            sqlInst += util.format(") values (%d, '%s', %d, %d, %d, getdate()); set @id = scope_identity(); ",
                data.msgId, contactInfo, data.postingId, data.toUserId, data.createdByUser);

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate";
            sqlInst += util.format(") values (%d, '%s', %d, %d, %d, getdate()); ",
                data.msgId, 'W1Buy (Administração): Contato enviado, aguarde averiguação.', data.postingId, data.fromUserId, data.toUserId);

            sqlInst += util.format("set @toUser = (select displayname from users where userid = %d); ", data.toUserId);
            sqlInst += util.format("set @fromUser = (select displayname from users where userid = %d); ", data.fromUserId);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, " +
                "[context], includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate());",
                data.portalId, data.subject, contactInfo, data.postingId, data.fromUserId, data.toUserId, data.fromUserId);

            sqlInst += `select email, firstname, lastname from users where userid = ${data.toUserId}; `;

            db.querySql(sqlInst, function (records, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    if (data.toUserId !== "2") {
                        if (res.app.locals.loggedInUsers[data.toUserId]) {
                            res.app.locals.loggedInUsers[data.toUserId].emit('usernames', 1);
                        }
                    }

                    if (records.recordsets[0]) {
                        let email = records.recordsets[0][0].email,
                            firstname = records.recordsets[0][0].firstname,
                            lastname = records.recordsets[0][0].lastname;

                        let emailText = `Caro(a) ${firstname} ${lastname}, há nova(s) mensagem(ns) sobre seu anúncio. \n\n
                                Endereço do Portal: ${req.headers.origin} \n
                                Seu login: ${email} \n\n
                                Obrigado!`;

                        // send the message and get a callback with an error or details of the message that was sent 
                        emailServer.send({
                            text: emailText,
                            from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                            to: '"' + firstname + ' ' + lastname + '" <' + email + '>',
                            subject: 'Nova(s) mensagem(ns) no portal W1Buy'
                        }, function (error, message) {
                            console.log(error || message);
                        });
                    }

                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.json(ex.message);
    }
};

// Request contact
// vscode-fold=7
exports.purchase = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int, @toUser nvarchar(100), @fromUser nvarchar(100); "
            sqlInst += `update w1buy_postingmessages set newmessage = 1, commentscount = (isnull(commentscount, 0) + 1), modifiedondate = getdate() where msgid = ${data.msgId}; `;

            // sqlInst += `update w1buy_postingmessages set newmessage = 1, commentscount = (commentscount + 1)
            //     , modifiedondate = getdate() where touserid = ${data.toUserId} and postingid = ${data.postingId}; `;

            sqlInst += `update w1buy_postings set complete = 1, modifiedondate = getdate() where postingid = ${data.postingId}; `;

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate";
            sqlInst += util.format(") values (%d, '%s', %d, %d, %d, getdate()); set @id = scope_identity(); ",
                data.msgId, data.toContactInfo, data.postingId, data.toUserId, data.createdByUser);

            data.fromContactInfo = data.fromContactInfo + "<strong>Nome:</strong> ' + (select firstname + ' ' + lastname as displayname from users where userid = " + data.toUserId + ") + '<br /> " +
                "<strong>Email:</strong> ' + (select email from users where userid = " + data.toUserId + ") + '<br /><strong>Telefone:</strong> ' + " +
                "(select telephone from users where userid = " + data.toUserId + ") + '<br /><strong>Celular:</strong> ' + " +
                "(select cell from users where userid = " + data.toUserId + ") + '<br />";

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid,  createdondate";
            sqlInst += util.format(") values (%d, '%s', %d, %d, %d, getdate()); ",
                data.msgId, data.fromContactInfo, data.postingId, data.fromUserId, data.createdByUser);

            sqlInst += util.format("set @toUser = (select displayname from users where userid = %d); ", data.toUserId);
            sqlInst += util.format("set @fromUser = (select displayname from users where userid = %d); ", data.fromUserId);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, [context]" +
                ", includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate());",
                data.portalId, data.subject, 'Conclusão de negociação', data.postingId, data.toUserId, data.fromUserId, data.createdByUser);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, [context]" +
                ", includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate());",
                data.portalId, data.subject, 'Conclusão de negociação', data.postingId, data.fromUserId, data.toUserId, data.createdByUser);

            sqlInst += `select email, firstname, lastname from users where userid = ${data.toUserId}; `;

            db.querySql(sqlInst, function (records, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    if (data.fromUserId !== "2") {
                        if (res.app.locals.loggedInUsers[data.fromUserId]) {
                            res.app.locals.loggedInUsers[data.fromUserId].emit('usernames', 1);
                        }
                    }
                    if (data.toUserId !== "2") {
                        if (res.app.locals.loggedInUsers[data.toUserId]) {
                            res.app.locals.loggedInUsers[data.toUserId].emit('usernames', 1);
                        }
                    }

                    if (records.recordsets[0]) {
                        let email = records.recordsets[0][0].email,
                            firstname = records.recordsets[0][0].firstname,
                            lastname = records.recordsets[0][0].lastname;

                        let emailText = `Caro(a) ${firstname} ${lastname}, há nova(s) mensagem(ns) sobre seu anúncio. \n\n
                                Endereço do Portal: ${req.headers.origin} \n
                                Seu login: ${email} \n\n
                                Obrigado!`;

                        // send the message and get a callback with an error or details of the message that was sent 
                        emailServer.send({
                            text: emailText,
                            from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                            to: '"' + firstname + ' ' + lastname + '" <' + email + '>',
                            subject: 'Nova(s) mensagem(ns) no portal W1Buy'
                        }, function (error, message) {
                            console.log(error || message);
                        });
                    }

                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.json(ex.message);
    }
};

exports.removeMsg = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int, @toUser nvarchar(100), @fromUser nvarchar(100); ";
            sqlInst += util.format("delete from w1buy_postingmessages where msgid = %d; ", data.msgId);

            sqlInst += util.format("insert into w1buy_postingmessages (portalid, touserid, fromuserid, msg, postingid, [subject], commentscount, newmessage" +
                ", priorityvalueamount, prioritydeliveryamount, createdondate, show, createdbyuser) values (%d, %d, %d, '%s', %d, '%s', 0, 1, 0, 0, getdate(), 'false', %d); set @id = scope_identity(); ",
                data.portalId, data.toUserId, data.fromUserId, "Sua mensagem foi excluida pelo destinatário.", data.postingId, "Mensagem do Administrador", data.fromUserId);

            sqlInst += "insert into w1buy_postingmessagecomments (msgid, commenttext, postingid, touserid, fromuserid, createdondate)";
            sqlInst += util.format(" values (@id, '%s', %d, %d, %d, getdate()); ",
                "Sua mensagem foi excluida pelo destinatário.", data.postingId, data.toUserId, data.fromUserId);

            sqlInst += util.format("insert into notifications (portalid, [to], [from], [subject], body, conversationid, senderuserid, [context]" +
                ", includedismissaction, createdbyuserid, createdondate) values (%d, @toUser, @fromUser, '%s', '%s', %d, %d, '%s', 'true', %d, getdate());",
                data.portalId, "Exclusão de mensagem", 'Sua mensagem foi excluida pelo destinatário.', data.postingId, data.fromUserId, data.toUserId, data.fromUserId);

            sqlInst += `select email, firstname, lastname from users where userid = ${data.toUserId}; `;

            db.querySql(sqlInst, function (records, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    if (data.toUserId !== "2") {
                        if (res.app.locals.loggedInUsers[data.toUserId]) {
                            res.app.locals.loggedInUsers[data.toUserId].emit('usernames', 1);
                        }
                    }

                    if (records.recordsets[0]) {
                        let email = records.recordsets[0][0].email,
                            firstname = records.recordsets[0][0].firstname,
                            lastname = records.recordsets[0][0].lastname;

                        let emailText = `Caro(a) ${firstname} ${lastname}, há nova(s) mensagem(ns) sobre seu anúncio. \n\n
                                Endereço do Portal: ${req.headers.origin} \n
                                Seu login: ${email} \n\n
                                Obrigado!`;

                        // send the message and get a callback with an error or details of the message that was sent 
                        emailServer.send({
                            text: emailText,
                            from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                            to: '"' + firstname + ' ' + lastname + '" <' + email + '>',
                            subject: 'Nova(s) mensagem(ns) no portal W1Buy'
                        }, function (error, message) {
                            console.log(error || message);
                        });
                    }

                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {

    }
};

// Adds comment to message
// vscode-fold=8
exports.saveFiles = function (req, res, reqBody, files) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "";

            if (files) {
                _.forEach(files, function (file) {
                    sqlInst += util.format("insert into w1buy_PostingFiles (portalid, conversationid, [filename], originalname, size, contenttype, imageurl, folder, touserid, fromuserid, createdondate) " +
                        "values (%d, %d, '%s', '%s', %d, '%s', '%s', '%s', %d, %d, getdate()); ",
                        data.portalId, data.postingId, file.filename, file.originalname, file.size, file.mimetype, file.path, file.destination, data.toUserId, data.fromUserId);
                });

                db.querySql(sqlInst, function (data, err) {
                    if (err) {
                        console.log(err.message);
                        // cb({
                        //     "error": err.message
                        // });
                        res.status(500).json({
                            error: err.message
                        });
                    } else {
                        res.json({
                            success: "success"
                        });
                        // cb({
                        //     "success": "success"
                        // });
                    }
                });
            } else {
                // throw new Error("Input not valid");
                return res.status(500).json(`Input not valid (status: 500)`);
            }
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.send(ex);
    };
};