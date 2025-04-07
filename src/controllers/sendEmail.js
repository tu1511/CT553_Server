const { CreatedResponse, OKResponse } = require("../response/success");
const SendEmailService = require("../services/sendEmail");

class SendEmailController {

    static async sendEmail(req, res) {
        new OKResponse({
            metadata: await SendEmailService.sendEmail(req.body.email, req.body.subject, req.body.content),
        }).send(res);
    }

   
}

module.exports = SendEmailController;
