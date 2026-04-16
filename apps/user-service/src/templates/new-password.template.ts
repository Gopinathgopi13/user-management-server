export const newPasswordTemplate = (name: string, password: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your New Password</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #00b894 0%, #00695c 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
    .text { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px; }
    .password-box { background: #f0fdf8; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; text-align: center; }
    .password-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #065f46; margin-bottom: 10px; }
    .password-box .password-value { font-family: 'Courier New', monospace; font-size: 22px; font-weight: 700; color: #059669; letter-spacing: 2px; }
    .warning { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; font-size: 13px; color: #92400e; line-height: 1.6; margin-bottom: 28px; }
    .footer { background: #f8fafc; border-top: 1px solid #e8edf2; padding: 20px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #9aa3af; margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Password Reset Successful</h1>
      <p>Your new password has been generated</p>
    </div>
    <div class="body">
      <p class="greeting">Hello, ${name}!</p>
      <p class="text">
        Your identity has been verified and a new password has been generated for your account.
        Use the password below to log in.
      </p>

      <div class="password-box">
        <div class="label">Your New Password</div>
        <div class="password-value">${password}</div>
      </div>

      <div class="warning">
        ⚠️ For your security, please change this password immediately after logging in.
        If you did not request this reset, contact your administrator immediately.
      </div>

      <p class="text">
        This password was auto-generated. We strongly recommend updating it to something memorable after your first login.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.<br />© ${new Date().getFullYear()} User Management System</p>
    </div>
  </div>
</body>
</html>
`;
