const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporterDetails = smtpTransport({
    host: "mail.nilobang.ir",
    port: 465,
    secure: true,
    auth: {
        user: "weblog@nilobang.ir",
        pass: "Faghat12!@",
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
})

exports.sendEmail=(email, fullname, subject, message)=> {
    const transporter = nodeMailer.createTransport(transporterDetails);

    transporter.sendMail({
        from: "weblog@nilobang.ir",
        to: email,
        subject,
        html: `<h1>Hello ${fullname}</h1>
                <p>${message}</p>`,
    }, (err, info) => {
        if (err) return console.log(err)
        console.log(info)
    })

}


