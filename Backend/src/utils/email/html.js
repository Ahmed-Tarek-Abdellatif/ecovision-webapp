export const signup = (otp) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>OTP Email</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
    <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff;">
      <header>
        <h1>Your OTP</h1>
      </header>
      <main>
        <p>Thank you for choosing our service. Your OTP is valid for 5 minutes:</p>
        <p
          style="
            margin: 0;
            margin-top: 30px;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 2px;
            color: #ba3d4f;
            text-align: center;
          "
        >
          ${otp}
        </p>
      </main>
      <footer>
        <p>Need help? Contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
      </footer>
    </div>
  </body>
</html>
`;
