import React, { forwardRef } from 'react';

const CustomInput = forwardRef(({
  id,
  name,
  type = "text",
  label,
  showLabel = true,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  required = false,
  disabled = false,
  autoComplete,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = "",
  inputClassName = "",
  labelClassName = "",
  containerClassName = "",
  error,
  ...props
}, ref) => {
  return (
    <div className={`${containerClassName}`}>
      {/* Label */}
      {showLabel && label && (
        <label 
          htmlFor={id || name} 
          className={`block text-white text-sm font-medium mb-2 font-inter ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className={`relative ${className}`}>
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full 
            ${Icon ? 'pl-10' : 'pl-4'} 
            ${RightIcon ? 'pr-12' : 'pr-4'} 
            py-3 
            bg-gray-800/50 
            border 
            ${error ? 'border-red-500' : 'border-gray-700'} 
            rounded-lg 
            text-white 
            placeholder-gray-400 
            focus:outline-none 
            focus:ring-2 
            ${error ? 'focus:ring-red-400' : 'focus:ring-lime-400'} 
            focus:border-transparent 
            transition-all 
            font-inter
            disabled:opacity-50 
            disabled:cursor-not-allowed
            ${inputClassName}
          `}
          {...props}
        />
        
        {/* Right Icon */}
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={onRightIconClick}
              className="text-gray-400 hover:text-lime-400 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              <RightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-400 font-inter">{error}</p>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;