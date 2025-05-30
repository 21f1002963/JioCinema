const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'mkmohitkumar700@gmail.com',// Change to your recipient
  from: '21f1002963@ds.study.iitm.ac.in', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })