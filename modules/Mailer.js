const mailjet = require('node-mailjet');
const fs = require('fs');
const Mustache = require('Mustache');
const baseTemplate = fs.readFileSync('./templates/mails/base.html', 'utf8');
const bookingSuccessTemplate = fs.readFileSync('./templates/mails/booking_success.html', 'utf8');

module.exports = class Mailer {

    constructor(options) {
        this.mailjet = mailjet.connect('d5413e6abe20d34572cbb66a684b5994', '2b69ac60d5952af7449129db7291a97e');
    }

    send(options) {
        this.mailjet.post("send").request({
            "FromEmail": "d.damien@live.fr",
            "FromName": "From name",
            "Subject": options.subject,
            "Html-part": options.html,
            "To": options.to
        }).then((result) => {
            console.log(result.body)
        }).catch((err) => {
            console.log(err.statusCode)
        });
    }

    sendBookingSuccess(email) {
        const html = Mustache.render(baseTemplate, {}, {content: bookingSuccessTemplate});

        this.send({
            subject: 'Booking success',
            html: html,
            to: email
        });
    }

}
