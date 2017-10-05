// scheduling tasks
const schedule = require('node-schedule');
const db = require('./core/db');
const util = require('util');
const _ = require('lodash');
const moment = require('moment');
const email = require('./config/emailConfig');

let mailSellerReport = function () {

    try {
        db.querySql(`select u.displayname, u.email, u.userid from w1buy_user_account a join users u on u.userid = a.userid where a.accounttype = 'seller'`,
            function (users, usersErr) {
                if (usersErr) {
                    console.log(usersErr.message);
                    return usersErr.message;
                } else {

                    _.forEach(users.recordsets[0], function (seller) {

                        let msgString = `<h3>Relatório diário de anúncios no portal da w1buy.</h3><br />`;

                        db.querySql(`select sellerreportplanid, userid from w1buy_seller_report_plans where userid = ${seller.userid};`,
                            function (plans, plansErr) {
                                if (plansErr) {
                                    console.log(plansErr.message);
                                    return plansErr.message;
                                } else {

                                    if (plans.recordsets[0].length) {

                                        _.forEach(plans.recordsets[0], function (plan) {

                                            db.querySql(`select keywordname from w1buy_seller_keywords where sellerreportplanid = ${plan.sellerreportplanid};
                                                        select city, region, localeid from w1buy_seller_locales where sellerreportplanid = ${plan.sellerreportplanid};`,
                                                function (planData, planDataErr) {
                                                    if (planDataErr) {
                                                        console.log(planDataErr.message);
                                                        return planDataErr.message;
                                                    } else {

                                                        // Check for keywords
                                                        if (planData.recordsets[0].length) {

                                                            _.forEach(planData.recordsets[0], function (keyword) {

                                                                // Check for locales
                                                                if (planData.recordsets[1].length) {}
                                                                _.forEach(planData.recordsets[1], function (locale) {

                                                                    let sqlInst = "declare @keywordids nvarchar(max); ";
                                                                    sqlInst += "set @keywordids = (select distinct cast(pk.postingid as varchar(10)) + ',' as [text()] from w1buy_postingkeywords pk ";
                                                                    sqlInst += "where pk.keywordname like '" + keyword.keywordname + "%' for xml path('')); ";

                                                                    sqlInst += "select  p.PostingId, l.Region as PosterRegion, l.City as PosterCity, u.displayname as PosterDisplayName, ";
                                                                    sqlInst += "(case isnull(p.condition, '0') when '1' then 'NOVO' when '2' then 'USADO' else 'NOVO ou USADO' end) as PostingCondition, ";
                                                                    sqlInst += `('[' + (select( + '{"LocaleId":"' + cast(l.localeid as nvarchar(max)) + '","City":"' + l.city + ' (' + l.region + ')' + '","Quantity":"' + cast(l.quantity as nvarchar(max)) + '"},') as [text()] from w1buy_postinglocales l where l.postingid = p.[postingid] for xml path('')) + ']') as Locales, `;
                                                                    sqlInst += "p.Quantity, p.Title from w1buy_postings p ";
                                                                    sqlInst += "join users u on p.userid = u.userid "
                                                                    sqlInst += "join w1buy_postinglocales l on p.postingid = l.postingid "
                                                                    sqlInst += "where p.postingid in (";
                                                                    sqlInst += "select i.name from dbo.w1buy_splitstring(@keywordids) as i) ";
                                                                    sqlInst += "and isnull(p.sellerpaid, 0) <= 0 and ('" + locale.localeid + "' = '' or l.localeid = '" + locale.localeid + "') ";

                                                                    db.querySql(sqlInst, function (postings, postingsErr) {
                                                                        if (postingsErr) {
                                                                            console.log(postingsErr.message);
                                                                            return postingsErr.message;
                                                                        } else {
                                                                            _.forEach(postings.recordsets[0], function (post) {

                                                                                msgString += `<h4><a href="https://www.w1buy.com.br/anuncios/${post.PostingId}/${seller.userid}">${post.Title}</a></h4><br />`;
                                                                                msgString += `Publicado em: ${moment(post.CreatedOnDate).locale("pt-BR").format('LLL')}<br />`;
                                                                                msgString += `Por: ${post.PosterDisplayName} <br />`;
                                                                                msgString += `Condição: ${post.PostingCondition} <br />`;

                                                                                let localesBuilder = '',
                                                                                    locales = JSON.parse(post.Locales.replace(/\,(?!\s*[\{\[\"\'\w])/g, ''));
                                                                                _.forEach(locales, function (locale) {
                                                                                    localesBuilder += `${locale.City} / Qde: ${locale.Quantity}, `
                                                                                });

                                                                                msgString += `Área(s) de escolha: ${localesBuilder}<br /><br />`;

                                                                                // send the message and get a callback with an error or details of the message that was sent 
                                                                                email.send({
                                                                                    text: msgString,
                                                                                    from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
                                                                                    to: '"' + seller.displayname + '" <' + seller.email + '>',
                                                                                    subject: 'Relatório diário de anúncios no portal W1Buy',
                                                                                    attachment: [{
                                                                                        data: msgString,
                                                                                        alternative: true
                                                                                    }]
                                                                                }, function (emailErr, message) {
                                                                                    console.log(emailErr || 'Message Sent');
                                                                                });

                                                                            });
                                                                        }
                                                                    });

                                                                });

                                                            });

                                                        }
                                                    }
                                                }, true);

                                        });

                                    }
                                }
                            });

                    });

                }
            });
    } catch (ex) {
        return ex;
    }

};

var sellerReportRule = new schedule.RecurrenceRule();
sellerReportRule.hour = 18
sellerReportRule.minute = 19
// sellerReportRule.second = 30
sellerReportRule.dayOfWeek = new schedule.Range(0, 6)

var dailySellerReportJob = schedule.scheduleJob(sellerReportRule, function () {
    console.log('I run on days at 7:00');
    mailSellerReport();
});

console.log('The seller report schdule has been initialzed');