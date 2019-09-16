const nodemailer = require('nodemailer');
const systemConfig = require(__pathConfig + 'system');
const NotFound   = require(__pathHelper + 'error');
module.exports = {
    sendMailConfirmAlert: async (text, toEmail) =>{
        let transporter = nodemailer.createTransport({ 
            service: 'Gmail',
            auth: {
                user: systemConfig.host_email,
                pass: systemConfig.host_password
            }
        });
        let mainOptions = { 
            from: 'SNS data analysis system',
            to: toEmail,
            subject: 'Alert from SNS data analysis system',
            text: text,
            html:   `<table id="t01" style="background-color: #f1f1c1;width: 100%;border: 1px solid black;border-collapse: collapse;  padding: 15px;text-align: left;">
                        <tr style=" border: 1px solid black;border-collapse: collapse;  padding: 15px;">
                            <th style="border: 1px solid black;border-collapse: collapse;  padding: 15px;">Time</th>
                            <th style="border: 1px solid black;border-collapse: collapse;  padding: 15px;">Alert</th> 
                        </tr>
                        <tr>
                            <td style="border: 1px solid black;border-collapse: collapse;  padding: 15px;">${new Date().toISOString()}</td>
                            <td style="border: 1px solid black;border-collapse: collapse;  padding: 15px;">${text}</td>
                        </tr>
                    </table>
                    <div>Click <a href="http://117.6.135.148:8553">here</a> to check alert now</div>`
        }
        return await transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                throw new NotFound(err.message);
            }
        });
        
    }
}