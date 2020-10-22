require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    }
});

let mailOptions = {
    from: 'genzr05@gmail.com',
    to: 'genzr05@gmail.com',
    subject: 'RTX 3080 Scraper',
    text: 'It Works'
};

const sendMail = (results) => {

    const mappedResults = results.map((result) => {
        return `Found stock at url ${result.scrapedURL}`
    })

    const stringResults = mappedResults.join();

    mailOptions.text = stringResults;

    transporter.sendMail(mailOptions, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfuly!');
        }
    });

}

module.exports = {
    sendMail
}