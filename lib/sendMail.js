var nodemailer = require('nodemailer');
var mail = fs.readFileSync('lib/gmail.txt').toString().replace(/\r/g, "").split('\n');

async function sendEmail({ to, subject, text }) {
    const transporter = nodemailer.createTransport({
        service: 'gamil',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: mail[0],
          pass: mail[1]
        }
    });
    // 메일 옵션 설정
    const mailOptions = {
        from: 'mygmail@gmail.com',
        to,
        subject,
        text,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;