


const nodeMailer = require("nodemailer");



function sendNotification(receiverEmail, status, firstName, lastName) {
    let subject, message;
    let transporter = nodeMailer.createTransport({
       // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure :false,
        auth: {
            user: "robinsyriak07@gmail.com",
            pass: "lmqf gnjw gvlp daew" // Use environment variables for sensitive data
        }
    });

    // Define a base style for the email
    const style = `
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                border-radius: 5px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
                line-height: 1.5;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #aaa;
            }
            .button {
                display: inline-block;
                padding: 10px 15px;
                background-color: #007BFF;
                color: white;
                text-decoration: none; 
                border-radius: 5px;
                margin-top: 10px;
            }
        </style>
    `;

    switch (status) {
        case "interested":
            subject = "Interest Notification";
            message = `
                <div class="container">
                    ${style}
                    <h1>Connect With You</h1>
                    <p>${firstName} ${lastName} is interested in your profile.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <a href="#" class="button">View Profile</a>
                </div>
                <div class="footer">
                    <p>Thank you for using our service!</p>
                </div>
            `;
            break;
        case "accepted":
            subject = "Connection Accepted";
            message = `
                <div class="container">
                    ${style}
                    <h1>Connection Accepted</h1>
                    <p>${firstName} ${lastName} has accepted your connection request.</p>
                    <p>Feel free to reach out!</p>
                    <a href="#" class="button">Send Message</a>
                </div>
                <div class="footer">
                    <p>Thank you for using our service!</p>
                </div>
            `;
            break;
        case "rejected":
            subject = "Connection Rejected";
            message = `
                <div class="container">
                    ${style}
                    <h1>Connection Rejected</h1>
                    <p>${firstName} ${lastName} has rejected your connection request.</p>
                    <p>We wish you better luck next time!</p>
                </div>
                <div class="footer">
                    <p>Thank you for using our service!</p>
                </div>
            `;
            break;
            case "dailyMail":
                subject = "YOU HAVE A NEW FRIEND REQUEST";
                message = `
                  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
                    <div style="background-color: #2196F3; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                      <h1 style="color: #fff; font-size: 32px; margin: 0;">New Friend Request!</h1>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; color: #333; line-height: 1.6;">
                      <p style="font-size: 18px; margin: 0;">Good news! You have received a new connection request.</p>
                      <p style="font-size: 16px; margin-top: 10px;">Someone is interested in connecting with you. You can review and respond to the request by visiting your profile.</p>
                      <p style="font-size: 16px; margin-top: 20px;">Don't miss out on an exciting new connection!</p>
                    </div>
                    <div style="background-color: #f4f4f4; text-align: center; padding: 15px; border-radius: 0 0 8px 8px; color: #777;">
                      <p style="font-size: 14px;">Thank you for using our service! 😊</p>
                      <a href="https://yourapp.com/profile" style="display: inline-block; background-color: #2196F3; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; margin-top: 20px;">View Request</a>
                    </div>
                  </div>
                `;
                break;
              

        default:
            console.error("Invalid status");
            return;
    }

    let mailOptions = {
        from: 'robinsyriak07@gmail.com',
        to: receiverEmail,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("Error sending email", error);
        }
        console.log("Email sent: " + info.response);
    });
}

module.exports={ sendNotification}