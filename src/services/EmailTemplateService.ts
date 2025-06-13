// Email Templates for Authentication System
// These templates can be used with Firebase Auth, SendGrid, or any email service

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface WelcomeEmailData {
  displayName: string;
  email: string;
  subscriptionTier: string;
  loginUrl: string;
}

interface PasswordResetData {
  displayName: string;
  resetUrl: string;
  expirationTime: string;
}

interface SubscriptionEmailData {
  displayName: string;
  subscriptionTier: string;
  price: string;
  nextBillingDate?: string;
  features: string[];
}

class EmailTemplateService {
  private baseUrl: string = window.location.origin;

  // Welcome email for new users
  generateWelcomeEmail(data: WelcomeEmailData): EmailTemplate {
    const subject = `Welcome to Ancient History Trivia! 🏛️`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Ancient History Trivia</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .welcome-badge { background-color: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
        .features-list { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
        .feature-item:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Welcome to Ancient History Trivia!</h1>
            <p>Your journey through ancient civilizations begins now</p>
        </div>
        
        <div class="content">
            <div class="welcome-badge">${data.subscriptionTier.toUpperCase()} MEMBER</div>
            
            <h2>Hello ${data.displayName}!</h2>
            
            <p>Thank you for joining our community of history enthusiasts! You're now part of an amazing group of learners exploring the fascinating world of ancient civilizations.</p>
            
            <div class="features-list">
                <h3>What you can do now:</h3>
                ${this.getSubscriptionFeatures(data.subscriptionTier).map(feature => 
                    `<div class="feature-item">${feature}</div>`
                ).join('')}
            </div>
            
            <p>Ready to test your knowledge? Start with our most popular quiz categories:</p>
            <ul>
                <li><strong>Ancient Egypt</strong> - Pharaohs, pyramids, and mysteries</li>
                <li><strong>Roman Empire</strong> - Gladiators, emperors, and conquests</li>
                <li><strong>Ancient Greece</strong> - Philosophy, mythology, and democracy</li>
                <li><strong>Mesopotamia</strong> - The cradle of civilization</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${data.loginUrl}" class="cta-button">Start Your First Quiz</a>
            </div>
            
            <p>If you have any questions, feel free to reach out to our support team. We're here to help make your learning experience amazing!</p>
            
            <p>Happy quizzing!<br>
            The Ancient History Trivia Team</p>
        </div>
        
        <div class="footer">
            <p>You received this email because you created an account at Ancient History Trivia.</p>
            <p>© 2025 Ancient History Trivia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Welcome to Ancient History Trivia!

Hello ${data.displayName}!

Thank you for joining our community of history enthusiasts! You're now a ${data.subscriptionTier} member.

What you can do now:
${this.getSubscriptionFeatures(data.subscriptionTier).map(feature => `• ${feature}`).join('\n')}

Ready to start? Visit: ${data.loginUrl}

If you have any questions, feel free to reach out to our support team.

Happy quizzing!
The Ancient History Trivia Team
`;

    return { subject, html, text };
  }

  // Password reset email
  generatePasswordResetEmail(data: PasswordResetData): EmailTemplate {
    const subject = `Reset your Ancient History Trivia password`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .alert-box { background-color: #fef3cd; border: 1px solid #fceeba; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .security-note { background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${data.displayName}!</h2>
            
            <p>We received a request to reset your password for your Ancient History Trivia account.</p>
            
            <div class="alert-box">
                <strong>⏰ This link expires in ${data.expirationTime}</strong>
            </div>
            
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
                <a href="${data.resetUrl}" class="cta-button">Reset My Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f8fafc; padding: 10px; border-radius: 4px;">${data.resetUrl}</p>
            
            <div class="security-note">
                <strong>Security Note:</strong><br>
                • If you didn't request this password reset, you can safely ignore this email<br>
                • Never share this reset link with anyone<br>
                • The link will expire after use or after ${data.expirationTime}
            </div>
            
            <p>If you continue to have trouble, contact our support team for assistance.</p>
            
            <p>Best regards,<br>
            The Ancient History Trivia Team</p>
        </div>
        
        <div class="footer">
            <p>This password reset was requested from IP address and timestamp information available in our security logs.</p>
            <p>© 2025 Ancient History Trivia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Reset your Ancient History Trivia password

Hello ${data.displayName}!

We received a request to reset your password for your Ancient History Trivia account.

This link expires in ${data.expirationTime}.

Reset your password here: ${data.resetUrl}

If you didn't request this password reset, you can safely ignore this email.

Best regards,
The Ancient History Trivia Team
`;

    return { subject, html, text };
  }

  // Subscription confirmation email
  generateSubscriptionEmail(data: SubscriptionEmailData): EmailTemplate {
    const subject = `Welcome to ${data.subscriptionTier} - Subscription Confirmed! 🎉`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Confirmed</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .subscription-badge { background-color: #10b981; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: bold; margin-bottom: 20px; }
        .features-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 20px 0; }
        .feature-item { background-color: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; }
        .pricing-box { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Subscription Confirmed!</h1>
            <p>Welcome to ${data.subscriptionTier}</p>
        </div>
        
        <div class="content">
            <div class="subscription-badge">${data.subscriptionTier.toUpperCase()}</div>
            
            <h2>Thank you, ${data.displayName}!</h2>
            
            <p>Your subscription has been successfully activated. You now have access to all the premium features that make learning ancient history even more engaging!</p>
            
            <div class="pricing-box">
                <h3>Subscription Details</h3>
                <p><strong>Plan:</strong> ${data.subscriptionTier}</p>
                <p><strong>Price:</strong> ${data.price}</p>
                ${data.nextBillingDate ? `<p><strong>Next Billing:</strong> ${data.nextBillingDate}</p>` : ''}
            </div>
            
            <div class="features-grid">
                <h3>Your ${data.subscriptionTier} benefits:</h3>
                ${data.features.map(feature => 
                    `<div class="feature-item">✓ ${feature}</div>`
                ).join('')}
            </div>
            
            <p>Ready to explore all your new features? Start by taking a quiz with unlimited questions or check out our exclusive expert content!</p>
            
            <div style="text-align: center;">
                <a href="${this.baseUrl}" class="cta-button">Explore Premium Features</a>
            </div>
            
            <p>Need help getting started? Check out our <a href="${this.baseUrl}/help">help center</a> or contact our premium support team.</p>
            
            <p>Happy learning!<br>
            The Ancient History Trivia Team</p>
        </div>
        
        <div class="footer">
            <p>Manage your subscription at any time in your <a href="${this.baseUrl}/profile">account settings</a>.</p>
            <p>© 2025 Ancient History Trivia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Subscription Confirmed!

Thank you, ${data.displayName}!

Your ${data.subscriptionTier} subscription has been successfully activated.

Subscription Details:
- Plan: ${data.subscriptionTier}
- Price: ${data.price}
${data.nextBillingDate ? `- Next Billing: ${data.nextBillingDate}` : ''}

Your benefits:
${data.features.map(feature => `• ${feature}`).join('\n')}

Start exploring: ${this.baseUrl}

Happy learning!
The Ancient History Trivia Team
`;

    return { subject, html, text };
  }

  // Trial reminder email
  generateTrialReminderEmail(data: { displayName: string; daysLeft: number; subscriptionTier: string; upgradeUrl: string }): EmailTemplate {
    const subject = `Your trial ends in ${data.daysLeft} days - Don't lose access! ⏰`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Reminder</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .countdown-box { background: linear-gradient(135deg, #fef3cd 0%, #fde68a 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .countdown-number { font-size: 48px; font-weight: bold; color: #d97706; margin: 10px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Trial Ending Soon</h1>
        </div>
        
        <div class="content">
            <h2>Hi ${data.displayName}!</h2>
            
            <p>We hope you've been enjoying your ${data.subscriptionTier} trial! We wanted to remind you that your free trial will end soon.</p>
            
            <div class="countdown-box">
                <div class="countdown-number">${data.daysLeft}</div>
                <p><strong>${data.daysLeft === 1 ? 'Day' : 'Days'} Remaining</strong></p>
            </div>
            
            <p>Don't lose access to all the amazing features you've been enjoying:</p>
            <ul>
                <li>Unlimited quiz questions</li>
                <li>All premium bundles</li>
                <li>Advanced statistics</li>
                <li>Cloud sync across devices</li>
                <li>Priority support</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${data.upgradeUrl}" class="cta-button">Continue with ${data.subscriptionTier}</a>
            </div>
            
            <p>Questions about your subscription? We're here to help - just reply to this email!</p>
            
            <p>Best regards,<br>
            The Ancient History Trivia Team</p>
        </div>
        
        <div class="footer">
            <p>Manage your subscription in your <a href="${this.baseUrl}/profile">account settings</a>.</p>
            <p>© 2025 Ancient History Trivia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Trial Ending Soon

Hi ${data.displayName}!

Your ${data.subscriptionTier} trial ends in ${data.daysLeft} ${data.daysLeft === 1 ? 'day' : 'days'}.

Continue enjoying unlimited access: ${data.upgradeUrl}

Questions? Just reply to this email!

Best regards,
The Ancient History Trivia Team
`;

    return { subject, html, text };
  }

  // Helper method to get subscription features
  private getSubscriptionFeatures(tier: string): string[] {
    switch (tier.toLowerCase()) {
      case 'free':
      case 'explorer':
        return [
          'Access to 3 question bundles',
          'Basic achievement system',
          'Local progress tracking'
        ];
      
      case 'scholar':
        return [
          'Access to all question bundles',
          'Unlimited daily questions',
          'Cloud sync across devices',
          'Advanced statistics',
          'No advertisements'
        ];
      
      case 'historian':
        return [
          'Everything in Scholar plan',
          'Expert commentary and explanations',
          'Priority customer support',
          'Advanced learning analytics',
          'Early access to new content'
        ];
      
      case 'academy':
        return [
          'Everything in Historian plan',
          'Lifetime access',
          'Institutional features',
          'API access for developers',
          'Custom quiz creation tools'
        ];
      
      default:
        return ['Access to premium features'];
    }
  }
}

// Export singleton instance
export const emailTemplateService = new EmailTemplateService();
export default emailTemplateService;
