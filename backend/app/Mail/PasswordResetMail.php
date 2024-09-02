<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;

    /**
     * Create a new message instance.
     *
     * @param string $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $url = env('FRONTEND_URL', 'https://inspiring-blancmange-b8b7ed.netlify.app') . '/password-reset?token=' . $this->token;
        return $this->subject('Password Reset Request')
                    ->html('
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Password Reset</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #ffffff;
                                    border: 1px solid #dddddd;
                                    border-radius: 8px;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                }
                                .header {
                                    text-align: center;
                                    padding: 10px 0;
                                    border-bottom: 1px solid #eeeeee;
                                }
                                .header h1 {
                                    margin: 0;
                                    font-size: 24px;
                                    color: #333333;
                                }
                                .content {
                                    padding: 20px;
                                    text-align: center;
                                }
                                .content p {
                                    font-size: 16px;
                                    line-height: 1.6;
                                    color: #666666;
                                }
                                .button {
                                    display: inline-block;
                                    margin-top: 20px;
                                    padding: 10px 20px;
                                    font-size: 16px;
                                    color: #ffffff;
                                    background-color: #007bff;
                                    text-decoration: none;
                                    border-radius: 5px;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 10px 0;
                                    margin-top: 20px;
                                    border-top: 1px solid #eeeeee;
                                }
                                .footer p {
                                    font-size: 14px;
                                    color: #999999;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Password Reset Request</h1>
                                </div>
                                <div class="content">
                                    <p>Click the button below to reset your password:</p>
                                    <a href="' . $url . '" class="button">Reset Password</a>
                                    <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                                </div>
                                <div class="footer">
                                    <p>Thank you,</p>
                                    <p>Your Company Name</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    ');
    }
    
}