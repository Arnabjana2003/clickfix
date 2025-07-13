export const getWelcomeMail = (customerName:string) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to ClicknFix!</title>
    <style type="text/css">
        /* Client-specific styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Reset styles */
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* Main styles */
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #333333;
            background-color: #f7f7f7;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
        }
        
        .content {
            background-color: #ffffff;
            padding: 30px;
        }
        
        .footer {
            background-color: #f1f1f1;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-radius: 0 0 8px 8px;
        }
        
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 20px 0;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
        }
        
        h1 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
        }
        
        p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        
        .highlight {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .social-icons {
            margin: 20px 0;
        }
        
        .social-icons a {
            margin: 0 10px;
            display: inline-block;
        }
        
        .divider {
            border-top: 1px solid #eeeeee;
            margin: 20px 0;
        }
        
        @media only screen and (max-width: 480px) {
            .container {
                width: 100% !important;
            }
            
            .content, .header, .footer {
                padding: 15px !important;
            }
            
            .button {
                width: 100% !important;
                padding: 12px !important;
            }
            
            h1 {
                font-size: 20px !important;
            }
            
            p {
                font-size: 14px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <!-- Main Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
        <tr>
            <td>
                <!-- Header with Logo -->
                <table class="header" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td align="center">
                            <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-fd24-61f7-9b76-2aed5551485d/raw?se=2025-07-05T22%3A53%3A11Z&sp=r&sv=2024-08-04&sr=b&scid=10d8d8e6-b931-59f8-9631-584a15bc5a4d&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-05T16%3A57%3A39Z&ske=2025-07-06T16%3A57%3A39Z&sks=b&skv=2024-08-04&sig=Qzx/1fQd2/ZY0Qlmb21ulIef4hOaw6kFKuPVrWqBIb8%3D" alt="ClicknFix Logo" class="logo" />
                        </td>
                    </tr>
                </table>
                
                <!-- Content -->
                <table class="content" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td>
                            <h1>Welcome to ClicknFix!</h1>
                            <p>Hello ${customerName || "Customer"},</p>
                            <p>We're thrilled to have you join the ClicknFix community! Now you can book professional home services with just a few clicks.</p>
                            
                            <p>Here's what you can do with your ClicknFix account:</p>
                            <ul>
                                <li>Book trusted professionals for all your home service needs</li>
                                <li>Schedule appointments at your convenience</li>
                                <li>Track your service requests in real-time</li>
                                <li>Get exclusive member discounts and offers</li>
                            </ul>
                            
                            <div align="center">
                                <a href="#" class="button" style="color: #ffffff;">Get Started Now</a>
                            </div>
                            
                            <p>Need help or have questions? Our customer support team is available 24/7 to assist you.</p>
                            
                            <p>Happy fixing!<br/>
                            <span class="highlight">The ClicknFix Team</span></p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer -->
                <table class="footer" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td>
                            <div class="social-icons">
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="24" /></a>
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" /></a>
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" /></a>
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" /></a>
                            </div>
                            
                            <p>&copy; 2024 ClicknFix. All rights reserved.</p>
                            <p>123 Fixit Street, Service City, SC 12345</p>
                            
                            <p>
                                <a href="#" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #4CAF50; text-decoration: none;">Terms of Service</a> | 
                                <a href="#" style="color: #4CAF50; text-decoration: none;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
};
