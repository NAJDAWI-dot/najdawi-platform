import * as nodemailer from 'nodemailer';

async function testEmails() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'najdawihashem01@gmail.com',
      pass: 'ymcwgqqysoevsjab',
    },
  });

  const to = 'najdawihashem06@gmail.com';
  const firstName = 'Hashem';
  const frontendUrl = 'http://localhost:4200';

  console.log('Sending Welcome Email...');
  const welcomeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Najdawi Platform</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #020617; color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .hero { width: 100%; height: 250px; background: linear-gradient(135deg, #10b981 0%, #047857 100%); position: relative; text-align: center; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: overlay; opacity: 0.5; }
        .hero-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; }
        .hero h1 { margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; text-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .content { padding: 40px; text-align: center; }
        .greeting { font-size: 24px; font-weight: 600; margin-bottom: 16px; color: #ffffff; }
        .message { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
        .btn { display: inline-block; background: linear-gradient(to right, #10b981, #059669); color: #ffffff; text-decoration: none; padding: 16px 32px; font-weight: 600; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5); transition: all 0.3s ease; }
        .footer { text-align: center; padding: 32px; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="hero">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Welcome background">
          <div class="hero-text">
            <h1>Welcome Aboard!</h1>
          </div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${firstName},</div>
          <div class="message">
            We are thrilled to have you join the <strong>Najdawi Platform</strong>! Your journey to mastering new skills and earning certifications starts here.<br><br>
            Explore our expert-led courses, complete interactive assignments, and earn premium certificates.
          </div>
          
          <a href="${frontendUrl}/courses" class="btn">Explore Courses</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Najdawi Platform. All rights reserved.<br>
          <span style="color: #10b981; font-weight: 600; margin-top: 8px; display: inline-block;">Najdawi System</span>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Najdawi Platform" <najdawihashem01@gmail.com>',
    to,
    subject: `✨ Welcome to the Najdawi Platform, ${firstName}!`,
    html: welcomeHtml,
  });
  console.log('✅ Welcome Email sent successfully!');

  console.log('Sending Nudge Email...');
  const courseTitle = 'Advanced Excel Functions';
  const progress = 85;
  
  const nudgeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Najdawi Platform - Nudge</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #020617; color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .hero { width: 100%; height: 250px; background: linear-gradient(135deg, #3b5bfc 0%, #1e3a8a 100%); position: relative; text-align: center; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: overlay; opacity: 0.5; }
        .hero-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; }
        .hero h1 { margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; text-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .content { padding: 40px; text-align: center; }
        .greeting { font-size: 24px; font-weight: 600; margin-bottom: 16px; color: #ffffff; }
        .message { font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
        .progress-box { background: rgba(59, 91, 252, 0.1); border: 1px solid rgba(59, 91, 252, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
        .progress-title { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #3b5bfc; margin-bottom: 8px; }
        .progress-value { font-size: 48px; font-weight: 800; color: #ffffff; margin: 0; }
        .btn { display: inline-block; background: linear-gradient(to right, #3b5bfc, #2563eb); color: #ffffff; text-decoration: none; padding: 16px 32px; font-weight: 600; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(59, 91, 252, 0.5); transition: all 0.3s ease; }
        .footer { text-align: center; padding: 32px; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="hero">
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop" alt="Premium background">
          <div class="hero-text">
            <h1>We Miss You!</h1>
          </div>
        </div>
        <div class="content">
          <div class="greeting">Hey ${firstName},</div>
          <div class="message">
            Great things happen when you keep your momentum going! You're already making fantastic progress in <strong>${courseTitle}</strong>. 
            Don't let your hard work pause now.
          </div>
          
          <div class="progress-box">
            <div class="progress-title">Current Progress</div>
            <div class="progress-value">${progress}%</div>
          </div>
          
          <a href="${frontendUrl}/student/dashboard" class="btn">Jump Back In</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Najdawi Platform. All rights reserved.<br>
          <span style="color: #3b5bfc; font-weight: 600; margin-top: 8px; display: inline-block;">Najdawi System</span>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Najdawi Platform" <najdawihashem01@gmail.com>',
    to,
    subject: `🚀 We miss you, ${firstName}! Keep your momentum going.`,
    html: nudgeHtml,
  });
  console.log('✅ Nudge Email sent successfully!');
}

testEmails().catch(console.error);
