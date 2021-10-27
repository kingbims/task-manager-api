const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config()
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;


const sendWelcomeEmail = (email, name) => {
  new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
    {
      'subject':'Thanks for joining in!',
      'sender' : {'email':'moremiabimbolamorakinyo@gmail.com'},
      'to' : [{name, email}],
      'textContent': `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }
  )
}


const sendCancelEmail = (email, name) => {
  new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
    {
      'subject':'I am sad to see you go!',
      'sender' : {'email':'moremiabimbolamorakinyo@gmail.com'},
      'to' : [{name, email}],
      'textContent': `Goodbye, ${name}. I hope to see you sometime soon.`
    }
  )
}


module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}