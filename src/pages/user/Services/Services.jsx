import React from 'react';
import { Plane, HeaterIcon as Helicopter, Package, Users } from 'lucide-react';
import ServiceCard from './ServiceCard';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: Plane,
      title: 'Private Jet Charters',
      description: 'Book fully personalized flights on our fleet of turboprop and twin-engine jets. Ideal for executive travel, client meetings, or weekend getaways — on your schedule, with no queues or delays.',
      details: {
        subtitle: 'Popular Routes:',
        items: ['Karachi ↔ Lahore', 'Islamabad ↔ Multan', 'Quetta ↔ Gwadar']
      }
    },
    {
      id: 2,
      icon: Helicopter,
      title: 'Helicopter Charters',
      description: 'Enjoy fast, direct access to hard-to-reach destinations or experience scenic aerial tours with our agile helicopter fleet. Whether it\'s a city transfer or a mountain escape, we\'ll get you there in style.',
      details: {
        subtitle: 'Use Cases:',
        items: ['Islamabad to Murree transfers', 'Hunza & Skardu aerial tours', 'Remote area access']
      }
    },
    {
      id: 3,
      icon: Package,
      title: 'Executive Air Cargo & Priority Deliveries',
      description: 'We handle time-sensitive cargo and priority package delivery through our certified air network — ensuring security, speed, and reliability.',
      details: {
        subtitle: 'Ideal For:',
        items: ['Medical supplies', 'High-value items', 'Corporate documents', 'Remote logistics']
      }
    },
    {
      id: 4,
      icon: Users,
      title: 'Business & VIP Travel Management',
      description: 'Let Jetrique handle your entire corporate travel plan — from aircraft selection to ground transport. Enjoy onboard Wi-Fi, private terminals, and VIP lounges for a truly first-class experience.',
      details: {
        subtitle: 'Options Include:',
        items: ['Multi-leg trips', 'Back-to-back meetings in different cities', 'Group travel solutions']
      }
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-mono">
              We offer
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Jetrique, we offer more than just transportation — we deliver curated, private aviation experiences across Pakistan. Whether it's a business trip, scenic escape, or a last-minute emergency flight, our services are designed to offer flexibility, safety, and sophistication from takeoff to touchdown.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;