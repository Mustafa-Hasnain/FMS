import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Book a Flight', href: '#' },
    { name: 'Explore Fleet', href: '#' },
    { name: 'Become a Member', href: '#' },
    { name: 'FAQs', href: '#' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Linkedin', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 font-mono">Contact</h3>
            <div className="space-y-3 text-gray-700">
              <p className="text-base">
                021 123 12345 <span className="font-semibold text-gray-900">(24/7)</span>
              </p>
              <p className="text-base">Jinnah International Airport</p>
              <p className="text-base">Karachi, Pakistan</p>
              <a
                href="mailto:support@jetrique.com"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-base"
              >
                support@jetrique.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 font-mono">Quick Links</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-blue-600 hover:text-blue-700 transition-colors duration-200 text-base"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-500">
              Copyright © 2025 Jetrique | Powered by Jetrique
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;