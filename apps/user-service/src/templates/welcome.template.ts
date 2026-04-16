export const welcomeTemplate = (name: string, email: string, password: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
    .text { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px; }
    .credentials-box { background: #f0f4ff; border: 1px solid #d0dcff; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; }
    .credentials-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #7a8ab0; margin-bottom: 4px; }
    .credentials-box .value { font-size: 15px; color: #1a1a2e; font-weight: 500; margin-bottom: 14px; }
    .credentials-box .value:last-child { margin-bottom: 0; }
    .credentials-box .password-value { font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: #1a73e8; letter-spacing: 1px; }
    .warning { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; font-size: 13px; color: #92400e; line-height: 1.6; margin-bottom: 28px; }
    .footer { background: #f8fafc; border-top: 1px solid #e8edf2; padding: 20px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #9aa3af; margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Welcome Aboard!</h1>
      <p>Your account has been created successfully</p>
    </div>
    <div class="body">
      <p class="greeting">Hello, ${name}!</p>
      <p class="text">
        Your account has been set up by an administrator. Below are your login credentials.
        Please keep them safe and change your password after your first login.
      </p>

      <div class="credentials-box">
        <div class="label">Email Address</div>
        <div class="value">${email}</div>
        <div class="label">Temporary Password</div>
        <div class="value password-value">${password}</div>
      </div>

      <div class="warning">
        ⚠️ For your security, please change this password immediately after logging in for the first time.
      </div>

      <p class="text">
        If you did not expect this email or believe it was sent in error, please ignore it or contact your administrator.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.<br />© ${new Date().getFullYear()} User Management System</p>
    </div>
  </div>
</body>
</html>
`;
