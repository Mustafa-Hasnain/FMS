import React from 'react';

const ServiceCard = ({ service }) => {
  const { icon, title, description, details } = service;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
      {/* Service Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
            <icon className="w-6 h-6 text-lime-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 font-mono mb-2">
            {title}
          </h3>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-lime-400 to-transparent mb-6"></div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Description:</h4>
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>

        {/* Details */}
        <div>
          <p className="font-semibold text-gray-900 mb-2">{details.subtitle}</p>
          <ul className="text-gray-600 space-y-1">
            {details.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-lime-600 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;