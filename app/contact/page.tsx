'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Heart, AlertTriangle, Users, Headphones } from 'lucide-react';
import Button from '@/components/Home/Button';
import FeatureCard from '@/components/Home/Feature_Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    urgency: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      urgency: 'general'
    });
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-red-600" />,
      title: '24/7 Emergency Hotline',
      description: 'For urgent blood requests and emergencies',
      contact: '+1 (555) 911-BLOOD',
      action: 'Call Now'
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      title: 'Email Support',
      description: 'General inquiries and non-urgent matters',
      contact: 'help@lifeconnect.org',
      action: 'Send Email'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-red-600" />,
      title: 'Live Chat',
      description: 'Instant support from our team',
      contact: 'Available 9 AM - 6 PM',
      action: 'Start Chat'
    },
    {
      icon: <Headphones className="w-6 h-6 text-red-600" />,
      title: 'Support Center',
      description: 'Comprehensive help and resources',
      contact: 'Online Help Center',
      action: 'Visit Center'
    }
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Health Avenue, Suite 100, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM'
    },
    {
      city: 'Los Angeles',
      address: '456 Medical Center Blvd, Los Angeles, CA 90210',
      phone: '+1 (555) 234-5678',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM'
    },
    {
      city: 'Chicago',
      address: '789 Donor Drive, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM'
    }
  ];

  const supportTypes = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      title: 'Emergency Blood Requests',
      description: 'Immediate assistance for critical blood needs',
      response: 'Response within 15 minutes'
    },
    {
      icon: <Users className="w-6 h-6 text-red-600" />,
      title: 'Donor Registration',
      description: 'Help with account setup and verification',
      response: 'Response within 2 hours'
    },
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: 'General Inquiries',
      description: 'Questions about our services and platform',
      response: 'Response within 24 hours'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact LifeConnect</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              We're here to help you save lives. Reach out to us for support,
              emergency blood requests, or any questions about our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <AlertTriangle className="h-6 w-6 mr-3" />
            <span className="font-semibold">
              Emergency Blood Request? Call our 24/7 hotline: +1 (555) 911-BLOOD
            </span>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the best way to reach us based on your needs. We're committed to
              providing quick and helpful responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method) => (
              <div key={method.title} className="text-center">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className="text-red-600 font-semibold mb-4">{method.contact}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {method.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-semibold text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="emergency">Emergency (Blood Needed Now)</option>
                    <option value="urgent">Urgent (Within 24 hours)</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-vertical"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <div className="text-center">
                <Button type="submit" variant="primary" size="lg" className="px-12">
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Support Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Can Help</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated support team handles different types of requests with varying response times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportTypes.map((type) => (
              <FeatureCard
                key={type.title}
                icon={type.icon}
                title={type.title}
                description={`${type.description} • ${type.response}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visit our physical locations for in-person support and blood donation services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office) => (
              <div key={office.city} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{office.city} Office</h3>
                </div>

                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <MapPin className="h-4 w-4 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                    {office.address}
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {office.phone}
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {office.hours}
                  </p>
                </div>

                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about LifeConnect.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How quickly can I find a blood donor?",
                a: "For emergency requests, we typically connect you with potential donors within 15-30 minutes. Our 24/7 emergency hotline ensures rapid response for critical situations."
              },
              {
                q: "Is the LifeConnect platform free to use?",
                a: "Yes, LifeConnect is completely free for both blood donors and those seeking donations. We believe life-saving services should be accessible to everyone."
              },
              {
                q: "How do you verify donor information?",
                a: "All donors go through a verification process including identity confirmation and basic health screening. We also maintain partnerships with certified healthcare facilities for additional safety measures."
              },
              {
                q: "Can I schedule regular donations through the platform?",
                a: "Absolutely! Our platform allows you to set up recurring donation schedules and sends reminders based on your blood type's donation intervals."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}