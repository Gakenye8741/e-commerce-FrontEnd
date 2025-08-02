import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useVerifyEmailMutation } from '../Features/Apis/userApi';
import Navbar from '../components/Navbar';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const prefilledEmail = location.state?.email || '';
  const [email] = useState(prefilledEmail);
  const [confirmationCode, setConfirmationCode] = useState('');

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    if (!prefilledEmail) {
      toast.error('No email provided. Please register first.');
      navigate('/register');
    }
  }, [prefilledEmail, navigate]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('🔄 Verifying email...');
    try {
      const response = await verifyEmail({ email, confirmationCode }).unwrap();
      toast.success(response.message || '✅ Email verified!', { id: loadingToast });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      toast.error(err?.data?.error || '❌ Verification failed.', { id: loadingToast });
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] px-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 max-w-md w-full text-white">
          <h2 className="text-2xl font-semibold text-center mb-6">
            ✉️ Email Verification
          </h2>

          <form onSubmit={handleVerification} className="space-y-5">
            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white border border-white/30 focus:ring-2 focus:ring-brandLight outline-none cursor-not-allowed"
              />
            </div>

            {/* Confirmation Code Input */}
            <div>
              <label htmlFor="confirmationCode" className="block text-sm font-medium mb-1">
                Confirmation Code
              </label>
              <input
                type="text"
                id="confirmationCode"
                placeholder="Enter your verification code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white border border-white/30 focus:ring-2 focus:ring-brandLight outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-all duration-200 transform ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brandDark hover:bg-brandMid hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email ✅'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
