const sendEmail = async(email , subject , htmlContent)=>{
    try
    {
        const nodemailer = require("nodemailer");
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_SENDER,
              pass: process.env.EMAIL_SENDER_PASS
            },
          });
        let info = await transporter.sendMail({
        from: '"Blog app" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: "", // plain text body
        html: htmlContent // html body
        });

        //console.log(info);
    }
    catch(err)
    {
        console.log(err);
        console.log("error in sending email");
    }
};

module.exports = sendEmail;