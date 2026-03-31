import { AuthService } from './src/services/authService';

const authService = new AuthService();

async function testResend() {
  const email = 'thecat_18@hotmail.com';
  console.log(`[TEST] Intended to resend code for ${email}`);
  
  try {
    const result = await authService.resendVerificationCode(email);
    console.log('[TEST SUCCESS]', result);
  } catch (error: any) {
    console.error('[TEST FAILURE]', error.message);
  }
}

testResend();
