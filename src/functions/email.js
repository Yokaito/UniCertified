import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import nodemailerConf from '../config/nodemailer'

var transport = nodemailer.createTransport(nodemailerConf);

transport.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.join(__dirname, '../views/email/partials/'),
        layoutsDir: path.join(__dirname, '../views/email/layout/'),
        defaultLayout: 'layout',
    },
    viewPath: path.join(__dirname, '../views/email/'),
}))

module.exports = (mailOptions) => {
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        /* console.log('Message sent: %s', info.messageId); */
    });
}