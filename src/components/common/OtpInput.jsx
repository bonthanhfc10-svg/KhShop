import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { validateOtp } from '../../utils/validation';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function OtpInput({ onSubmit, onResend, email }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resendEnabled, setResendEnabled] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    if (countdown > 0 && !resendEnabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { setResendEnabled(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, resendEnabled]);

  const handleChange = useCallback((index, value) => {
    const digit = value.replace(/[^0-9]/g, '');
    if (!digit && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrors({});
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }, [otp]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const newOtp = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    setErrors({});
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrors({});
    const otpString = otp.join('');
    const validationErrors = validateOtp(otpString);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(otpString);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Verification failed. Please try again.';
      setErrors({ api: message });
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendEnabled || !email) return;
    setResending(true);
    setErrors({});
    try {
      await onResend(email);
      setCountdown(RESEND_COOLDOWN);
      setResendEnabled(false);
    } catch (err) {
      setErrors({ api: err?.response?.data?.message || 'Failed to resend code.' });
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} noValidate>
      {errors.api && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errors.api}
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

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Verifying…
          </span>
        ) : (
          'Verify'
        )}
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-500">
          Didn&apos;t receive the code?{' '}
          {resendEnabled ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-black underline hover:text-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-400"
            >
              {resending ? 'Sending…' : 'Resend Code'}
            </button>
          ) : (
            <span className="text-neutral-400">Resend in {countdown}s</span>
          )}
        </p>
      </div>
    </form>
  );
}
