const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const myOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_MAILER_CLIENT_ID,
  process.env.GOOGLE_MAILER_CLIENT_SECRET
);

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

class SendEmailService {
  static async sendEmail(email, subject, content) {
    if (!email || !subject || !content)
      throw new Error("Please provide email, subject and content!");

    try {
      // Lấy Access Token
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      const myAccessToken = myAccessTokenObject?.token;

      // Cấu hình Nodemailer với OAuth2
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.ADMIN_EMAIL_ADDRESS, // Đảm bảo email này chính xác
          clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
          clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
          refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken,
        },
      });

      // Thiết lập thông tin email
      const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: content, // Nội dung email
      };

      // Gửi email
      await transport.sendMail(mailOptions);

      return { message: "Email sent successfully" };
    } catch (error) {
      // Nếu có lỗi, trả về thông báo lỗi
      console.error(error);
      return { message: error.message };
    }
  }
}

module.exports = SendEmailService;
