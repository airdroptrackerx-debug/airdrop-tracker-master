// Email Service for sending OTP codes

/**
 * Send OTP to user's email
 * Note: In production, this should use a backend service (Firebase Functions + SendGrid/Nodemailer)
 * For now, we'll simulate the email sending and log to console
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll use EmailJS if configured, or show in console
    
    const emailJSServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailJSTemplateId = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID;
    const emailJSPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (emailJSServiceId && emailJSTemplateId && emailJSPublicKey) {
      // Use EmailJS if configured
      const emailjs = (window as any).emailjs;
      
      if (emailjs) {
        await emailjs.send(
          emailJSServiceId,
          emailJSTemplateId,
          {
            to_email: email,
            otp_code: otp,
            app_name: 'Airdrop Tracker',
            valid_minutes: '10',
          },
          emailJSPublicKey
        );
        console.log(`✅ OTP email sent to ${email}`);
      } else {
        // Fallback: Log to console
        console.log('📧 OTP EMAIL (EmailJS not loaded)');
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log('Valid for: 10 minutes');
      }
    } else {
      // Development mode: Show OTP in console
      console.log('=================================');
      console.log('📧 OTP EMAIL (Development Mode)');
      console.log('=================================');
      console.log(`To: ${email}`);
      console.log(`Your OTP Code: ${otp}`);
      console.log(`Valid for: 10 minutes`);
      console.log('=================================');
      
      // Show browser notification in development
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('OTP Code Sent', {
          body: `Your OTP: ${otp}\nCheck console for details.`,
          icon: '/favicon2.ico',
        });
      }
    }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    // Still log to console as fallback
    console.log('=================================');
    console.log('📧 OTP EMAIL (Fallback)');
    console.log('=================================');
    console.log(`To: ${email}`);
    console.log(`Your OTP Code: ${otp}`);
    console.log(`Valid for: 10 minutes`);
    console.log('=================================');
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
