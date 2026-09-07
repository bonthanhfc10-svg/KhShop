import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { storage } from '../../../utils/storage';
import AuthLayout from '../../../components/common/AuthLayout';
import OtpInput from '../../../components/common/OtpInput';
import { ShieldCheck, Mail } from 'lucide-react';

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [success, setSuccess] = useState(false);

  const handleVerify = async (otp) => {
    await authService.verifyResetOtp({ email, otp });
    storage.set('khshop_reset_email', email);
    storage.set('khshop_reset_otp', otp);
    setSuccess(true);
    setTimeout(() => {
      navigate('/reset-password');
    }, 1000);
  };

  if (success) {
    return (
      <AuthLayout title="OTP Verified!" subtitle="Your OTP has been verified. Redirecting to reset password…">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="heading-display text-2xl text-neutral-900">Verified!</h2>
          <p className="mt-2 text-sm text-neutral-500">Redirecting to reset password…</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email to verify the password reset."
      footer={
        <Link to="/forgot-password" className="font-semibold text-black underline">
          Back to forgot password
        </Link>
      }
    >
      {email && (
        <div className="mb-4 flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <Mail size={16} className="shrink-0 text-neutral-500" />
          <span className="truncate">{email}</span>
        </div>
      )}
      <OtpInput onSubmit={handleVerify} onResend={(e) => authService.resendResetOtp(e)} email={email} />
    </AuthLayout>
  );
}
