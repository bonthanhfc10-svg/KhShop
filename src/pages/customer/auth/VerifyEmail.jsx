import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import { authService } from '../../../services/authService';
import { storage } from '../../../utils/storage';
import AuthLayout from '../../../components/common/AuthLayout';
import OtpInput from '../../../components/common/OtpInput';
import { ShieldCheck, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [success, setSuccess] = useState(false);

  const handleVerify = async (otp) => {
    const response = await authService.verifyEmail({ email, otp });
    const token = response?.data?.token;
    const user = response?.data?.user;
    if (token) {
      storage.set('token', token);
      storage.set('user', user);
    }
    setSuccess(true);
    setTimeout(() => {
      navigate(isAdmin ? '/admin/dashboard' : '/account');
    }, 1000);
  };

  if (success) {
    return (
      <AuthLayout title="Email Verified!" subtitle="Your email has been verified successfully.">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="heading-display text-2xl text-neutral-900">Verified!</h2>
          <p className="mt-2 text-sm text-neutral-500">Your account is now active. Redirecting...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We sent a 6-digit code to your email. Enter it below to verify your account."
      footer={
        <Link to="/login" className="font-semibold text-black underline">
          Back to Sign In
        </Link>
      }
    >
      {email && (
        <div className="mb-4 flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <Mail size={16} className="shrink-0 text-neutral-500" />
          <span className="truncate">{email}</span>
        </div>
      )}
      <OtpInput onSubmit={handleVerify} onResend={(e) => authService.resendVerificationOtp(e)} email={email} />
    </AuthLayout>
  );
}
