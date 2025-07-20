import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomInput from '../../components/custom/CustomInput';
import CustomButton from '../../components/custom/CustomButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   const result = login(formData.email, formData.password);
    //   if (result.success) {
    //     toast.success('Welcome back!');
    //     navigate(from, { replace: true });
    //   } else {
    //     toast.error(result.error);
    //   }
    // } catch (error) {
    //   toast.error('Something went wrong. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
    if(formData.email == 'admin' && formData.password == 'admin'){
      navigate("/admin/search");
    }
    else{
      navigate("/search");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Login Card */}
      <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 sm:px-[25%] sm:py-12 shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading mb-2">
            Welcome to Jetique
          </h1>
          <p className="sub-heading">
            Log in to your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <CustomInput
            id="email"
            name="email"
            type="email"
            label="Email"
            showLabel={true}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            autoComplete="email"
            required={true}
          />

          {/* Password Field */}
          <CustomInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            showLabel={true}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            autoComplete="current-password"
            required={true}
          />
          {/* Forgot Password */}
          <div className='mt-2'>
            <Link
              to="/forgot-password"
              className="text-[#CDFF00] text-sm hover:text-lime-300 transition-colors font-inter"
            >
              Forgot password?
            </Link>
          </div>



          {/* Login Button */}
          <CustomButton
            type="submit"
            variant="primary"
            loading={loading}
            text="Login"
            onClickText='Signing in...'

          />
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm font-inter">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-lime-400 hover:text-lime-300 font-medium transition-colors font-inter"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        {/* <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-xs font-medium mb-2 text-center">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>User: john@example.com / password123</p>
            <p>Admin: admin@flightbook.com / admin123</p>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Login;