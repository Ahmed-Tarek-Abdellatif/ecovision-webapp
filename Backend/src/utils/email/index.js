import nodemailer from "nodemailer";

export const sendemail = async ({ to, html }) => {
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP host
      port: 587, // TLS encryption port
      secure: false, // True for port 465 (SSL), false for port 587 (TLS)
      auth: {
        user: process.env.EMAIL, // Sender email from environment variables
        pass: process.env.PASSWORD, // Sender email password
      },
    });

    // Prepare email details
    const mailOptions = {
      from: `"EcoVision" <${process.env.EMAIL}>`, // Sender's name and email
      to, // Recipient's email address
      subject: "Your OTP Code", // Subject line
      html, // Email content passed in the parameter
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Check if the email was successfully sent
    if (info.rejected.length > 0) {
      console.error("Email rejected: ", info.rejected);
      return false;
    }

    console.log("Email sent successfully: ", info.response); // Optional debugging
    return true;
  } catch (error) {
    console.error("Error sending email: ", error); // Log errors for debugging
    return false;
  }
};
