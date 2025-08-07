import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useLoginUserMutation } from '../Features/Apis/userApi';
import Navbar from '../components/Navbar';
import loginImage from '../assets/image-aVMcBoKPxWSQV3iw3xPRFYGVBDZwzN.png'; // Update path if needed
import { setCredentials } from '../Features/Auth/AuthSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const dispatch = useDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Logging in...');
    try {
      const res = await loginUser(formData).unwrap();
      dispatch(setCredentials(res))
      toast.success('✅ Login successful!', { id: loadingToast });
      if(res.role === "admin"){
        setTimeout(() => navigate('/Admindashboard/ManageCategories'), 1000); 
      }else{
         setTimeout(() => navigate('/dashboard'), 1000); 
      }
      
    } catch (err: any) {
      toast.error(err?.data?.error || '❌ Login failed!', { id: loadingToast });
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] px-4 py-8">
        {/* Left side image */}
        <div className="hidden md:flex w-1/2 justify-center">
          <img src={loginImage} alt="Login Illustration" className="max-w-md w-full" />
        </div>

        {/* Right side form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
          <h2 className="text-2xl font-semibold text-center mb-6">
            🔐 Login to Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white border border-white/30 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white border border-white/30 focus:ring-2 focus:ring-blue-400 outline-none"
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
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login 🔓'
              )}
            </button>

            <p className="text-sm text-center mt-4">
              Don’t have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-blue-300 hover:underline cursor-pointer"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
