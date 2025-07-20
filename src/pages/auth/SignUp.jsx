import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomInput from '../../components/custom/CustomInput';
import CustomButton from '../../components/custom/CustomButton';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateUsername = (username) => {
    // Username should be 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    let isValid = true;

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscores only)';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, and number';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try {
      // Clear previous errors
      setErrors({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Validate form
      if (!validateForm()) {
        toast.error('Please resolve the issues and try again');
        setLoading(false);
        return;
      }

    //   // All validations passed, proceed with signup
    //   const result = signup(formData.username, formData.email, formData.password);
    //   if (result.success) {
    //     toast.success('Account created successfully! Welcome to Jetique!');
    //     navigate(from, { replace: true });
    //   } else {
    //     toast.error('Error occurred. Please try again.');
    //   }
    // } catch (error) {
    //   toast.error('Error occurred. Please try again.');
    // } finally {
    //   setLoading(false);
    // }

    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <>
      {/* Signup Card */}
      <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 sm:px-[25%] sm:py-12 shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading mb-2">
            Create Account
          </h1>
          <p className="sub-heading">
            Join Jetique and start your journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username Field */}
          <CustomInput
            id="username"
            name="username"
            type="text"
            label="Username"
            showLabel={true}
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            icon={User}
            autoComplete="username"
            required={true}
            error={errors.username}
          />

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
            error={errors.email}
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
            autoComplete="new-password"
            required={true}
            error={errors.password}
          />

          {/* Confirm Password Field */}
          <CustomInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            showLabel={true}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            autoComplete="new-password"
            required={true}
            error={errors.confirmPassword}
          />

          {/* Signup Button */}
          <CustomButton
            type="submit"
            variant="primary"
            loading={loading}
            text="Create Account"
            onClickText='Creating account...'
          />
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm font-inter">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-lime-400 hover:text-lime-300 font-medium transition-colors font-inter"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;