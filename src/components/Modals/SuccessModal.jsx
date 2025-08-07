import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({ 
    isOpen, 
    onClose, 
    title = "Success!", 
    message = "Your request has been submitted successfully.", 
    redirectMessage = "Redirecting to home page",
    redirectSeconds = 5,
    onRedirect
}) => {
    const [seconds, setSeconds] = useState(redirectSeconds);

    useEffect(() => {
        if (isOpen) {
            setSeconds(redirectSeconds);
            
            const interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        if (onRedirect) {
                            onRedirect();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isOpen, redirectSeconds, onRedirect]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-2xl transition-all">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Content */}
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/20 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Countdown */}
                        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                            <p className="text-sm text-gray-400 mb-2">
                                {redirectMessage} in
                            </p>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#CDFF00] text-black font-bold text-lg">
                                    {seconds}
                                </div>
                                <span className="text-gray-400 text-sm">
                                    second{seconds !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Manual Action Button */}
                        <button
                            onClick={onRedirect}
                            className="mt-4 w-full px-4 py-2 bg-[#CDFF00] text-black rounded-lg hover:bg-[#B8E600] transition-colors font-medium"
                        >
                            Go to Home Page Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;