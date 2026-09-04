import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateOtp } from '../../utils/validation';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';
import AuthLayout from '../../components/common/AuthLayout';
import { ShieldCheck, Mail, Loader2 } from 'lucide-react';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
  const { isAdmin, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resendEnabled, setResendEnabled] = useState(true);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (countdown > 0 && !resendEnabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, resendEnabled]);

  const handleChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, '');
    if (!digit && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setServerError('');
    setErrors({});

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;

    const newOtp = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setServerError('');
    setErrors({});

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setServerError('');
    setErrors({});

    const otpString = otp.join('');
    const validationErrors = validateOtp(otpString);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyEmail({ email, otp: otpString });
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
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Verification failed. Please try again.';
      setServerError(message);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendEnabled || !email) return;
    setResending(true);
    setServerError('');
    setResendSuccess(false);
    try {
      await authService.resendVerificationOtp(email);
      setCountdown(RESEND_COOLDOWN);
      setResendEnabled(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  if (success) {
    return (
      <AuthLayout title="Email Verified!" subtitle="Your email has been verified successfully.">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="heading-display text-2xl text-neutral-900">Verified!</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Your account is now active. Redirecting...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We sent a 6-digit code to your email. Enter it below to verify your account."
      footer={
        <>
          <Link to="/login" className="font-semibold text-black underline">
            Back to Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleVerify} noValidate>
        {email && (
          <div className="mb-4 flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <Mail size={16} className="shrink-0 text-neutral-500" />
            <span className="truncate">{email}</span>
          </div>
        )}

        {authError && (
          <p className="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent" role="alert">
            {authError}
          </p>
        )}

        {serverError && (
          <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {serverError}
          </p>
        )}

        <div className="mb-6">
          <label className="label-kh mb-3 block text-center">Verification Code</label>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`h-14 w-12 text-center text-xl font-display font-bold outline-none transition-all duration-200 border-b-2 ${
                  errors.otp
                    ? 'border-red-500 text-red-600 focus:border-red-500'
                    : digit
                    ? 'border-black text-black'
                    : 'border-neutral-300 text-neutral-400 focus:border-black'
                }`}
                aria-label={`Digit ${index + 1}`}
                disabled={loading}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="mt-2 text-center text-xs text-red-600">{errors.otp}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Verifying…
            </span>
          ) : (
            'Verify Email'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            Didn&apos;t receive the code?{' '}
            {resendSuccess && (
              <span className="font-semibold text-emerald-600">A new OTP has been sent to your email.</span>
            )}
            {!resendSuccess && resendEnabled ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-black underline hover:text-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                {resending ? 'Sending…' : 'Resend Code'}
              </button>
            ) : !resendSuccess ? (
              <span className="text-neutral-400">
                Resend in {formatTime(countdown)}
              </span>
            ) : null}
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
