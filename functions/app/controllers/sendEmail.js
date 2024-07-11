const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

async function sendEmail(data) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
        to: 'vanessa.batisti@viggascolab.com.br',
        from: 'vanessa.batisti@viggascolab.com.br',
        subject: `Mensagem enviada por ${data.name} para o Portal Viggas`,
        html: `  <table width="100%">
        <tr>
          <th colspan="2" align="center">
            <h1>Mensagem enviada por ${data.name} para o Portal Viggas</h1>
          </th>
        </tr>
        <tr>
          <th width="150">Nome:</th>
          <td>${data.name}</td>
        </tr>
        <tr>
          <th>Organização</th>
          <td>${data.name}</td>
        </tr>
        <tr>
          <th>Email:</th>
          <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <th>Phone:</th>
          <td>${data.telefone}</td>
        </tr>
        <tr>
          <td colspan="2" class="content" style="padding: 20px;">
            <p class="message" style="font-size: 16px; line-height: 1.5;">
              ${data.mensagem}
            </p>
          </td>
        </tr>
      </table>`
    };

    await sgMail.send(message).then(() => { 
        console.log('Email sent successfully!');
    }).catch((error) => {
        console.error('Error sending email:', error);
    });
}

module.exports = sendEmail