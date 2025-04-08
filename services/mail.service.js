const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor(otp) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }
  async sendActivationMail(toEmail, otp) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"), 
      to: toEmail,
      subject: "Fitnes shop akkauntini faollashtirish",
      text: "",
      html: `
      <div>
        <h3>Akkauntni faollashtirish uchun quyidagi kodni kiriting:</h3>
        <h1>${otp}</h1>
      </div>`,
    });
  }
}

module.exports = new MailService();
