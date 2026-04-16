export const otpTemplate = (name: string, otp: string, expiresInMinutes: number = 10): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset OTP</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #e84118 0%, #c0392b 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
    .text { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px; }
    .otp-box { text-align: center; background: #fff3f3; border: 2px dashed #e84118; border-radius: 10px; padding: 28px 24px; margin-bottom: 28px; }
    .otp-box .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9e3a2f; margin-bottom: 12px; }
    .otp-box .otp-code { font-family: 'Courier New', monospace; font-size: 42px; font-weight: 800; color: #c0392b; letter-spacing: 10px; line-height: 1; }
    .otp-box .otp-expiry { margin-top: 12px; font-size: 13px; color: #9e3a2f; }
    .warning { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; font-size: 13px; color: #92400e; line-height: 1.6; margin-bottom: 28px; }
    .footer { background: #f8fafc; border-top: 1px solid #e8edf2; padding: 20px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #9aa3af; margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Password Reset</h1>
      <p>We received a request to reset your password</p>
    </div>
    <div class="body">
      <p class="greeting">Hello, ${name}!</p>
      <p class="text">
        We received a request to reset the password for your account.
        Use the OTP below to verify your identity. Once verified, a new password will be generated and sent to you.
      </p>

      <div class="otp-box">
        <div class="otp-label">Your One-Time Password</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱ Expires in <strong>${expiresInMinutes} minutes</strong></div>
      </div>

      <div class="warning">
        ⚠️ If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        Never share this OTP with anyone.
      </div>

      <p class="text">
        This OTP is valid for a single use only and will expire after ${expiresInMinutes} minutes.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.<br />© ${new Date().getFullYear()} User Management System</p>
    </div>
  </div>
</body>
</html>
`;
