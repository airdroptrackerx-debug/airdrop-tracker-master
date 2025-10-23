// OTP Generation and Verification Utilities

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP temporarily in sessionStorage with expiry
 */
export const storeOTP = (email: string, otp: string): void => {
  const otpData = {
    otp,
    email,
    timestamp: Date.now(),
    expiresIn: 10 * 60 * 1000, // 10 minutes
  };
  sessionStorage.setItem('signup_otp', JSON.stringify(otpData));
};

/**
 * Verify OTP against stored value
 */
export const verifyOTP = (email: string, inputOTP: string): { success: boolean; error?: string } => {
  const storedData = sessionStorage.getItem('signup_otp');
  
  if (!storedData) {
    return { success: false, error: 'OTP expired or not found. Please request a new one.' };
  }
  
  try {
    const otpData = JSON.parse(storedData);
    const currentTime = Date.now();
    const timeElapsed = currentTime - otpData.timestamp;
    
    // Check if OTP expired (10 minutes)
    if (timeElapsed > otpData.expiresIn) {
      sessionStorage.removeItem('signup_otp');
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }
    
    // Check if email matches
    if (otpData.email !== email) {
      return { success: false, error: 'Email mismatch. Please start over.' };
    }
    
    // Check if OTP matches
    if (otpData.otp !== inputOTP) {
      return { success: false, error: 'Invalid OTP. Please check and try again.' };
    }
    
    // Success!
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Invalid OTP data. Please try again.' };
  }
};

/**
 * Clear OTP data after successful verification
 */
export const clearOTP = (): void => {
  sessionStorage.removeItem('signup_otp');
};

/**
 * Get remaining time for OTP validity
 */
export const getOTPRemainingTime = (): number => {
  const storedData = sessionStorage.getItem('signup_otp');
  
  if (!storedData) return 0;
  
  try {
    const otpData = JSON.parse(storedData);
    const currentTime = Date.now();
    const timeElapsed = currentTime - otpData.timestamp;
    const remainingTime = otpData.expiresIn - timeElapsed;
    
    return remainingTime > 0 ? Math.floor(remainingTime / 1000) : 0;
  } catch (error) {
    return 0;
  }
};
