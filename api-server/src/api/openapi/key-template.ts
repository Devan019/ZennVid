
export const keyTemplate = ({name, apiKey, user} : { name: string, apiKey: string, user: { email: string, username: string } }) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>API Key</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f8; color:#333;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:#4f46e5; padding:20px; text-align:center; color:#fff; font-size:22px; font-weight:bold;">
            🔑 ZennVid API Key
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px; margin-bottom:16px;">Hello <strong>${user?.username || "there"}</strong>,</p>
            <p style="font-size:15px; line-height:1.5;">
              Your API key for <strong>${name}</strong> has been generated successfully.  
              Please keep this key safe — it provides access to your application’s API.
            </p>
  
            <div style="margin:24px 0; padding:16px; background:#f3f4f6; border-radius:6px; text-align:center; border:1px dashed #4f46e5;">
              <p style="margin:0; font-size:14px; color:#555;">Your API Key</p>
              <p style="margin:8px 0 0; font-size:18px; font-weight:bold; color:#111;">${apiKey}</p>
            </div>
  
            <p style="font-size:14px; color:#666; margin-top:20px;">
              ⚠️ Do not share this key publicly. If you believe it has been compromised, generate a new one immediately from your dashboard.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#777;">
            &copy; ${new Date().getFullYear()} ZennVid. All rights reserved.<br/>
            This is an automated message, please do not reply.
          </td>
        </tr>
      </table>
    </body>
    </html>`
}