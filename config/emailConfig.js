const email = require("emailjs");
const emailServer = email.server.connect({
    user: "w1buy@w1buy.com.br",
    password: "+senha123",
    host: "smtp.gmail.com",
    ssl: true
});

module.exports = emailServer;