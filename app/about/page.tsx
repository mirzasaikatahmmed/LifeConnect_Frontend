import React from 'react';
import { Heart, Users, Shield, Award, Clock, MapPin, Target, Eye, Handshake } from 'lucide-react';
import Button from '@/components/Home/Button';
import FeatureCard from '@/components/Home/Feature_Card';

export default function AboutPage() {
  const stats = [
    { number: '15K+', label: 'Lives Saved', icon: Heart },
    { number: '8K+', label: 'Active Donors', icon: Users },
    { number: '100+', label: 'Partner Hospitals', icon: Shield },
    { number: '50+', label: 'Cities Covered', icon: MapPin },
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: 'Compassion',
      description: 'We believe in the power of human kindness and the willingness to help others in their time of need.'
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: 'Safety First',
      description: 'Every donation follows strict medical protocols to ensure the safety of both donors and recipients.'
    },
    {
      icon: <Users className="w-6 h-6 text-red-600" />,
      title: 'Community',
      description: 'Building a strong network of donors and healthcare providers working together to save lives.'
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: 'Reliability',
      description: 'Available 24/7 for emergency blood requests with quick response times when every second counts.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Medical Director',
      description: 'Leading hematologist with 15+ years of experience in blood banking and transfusion medicine.'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      description: 'Expert in healthcare logistics ensuring efficient blood collection and distribution processes.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Outreach',
      description: 'Passionate advocate for blood donation awareness and community engagement programs.'
    },
    {
      name: 'Dr. Ahmed Hassan',
      role: 'Quality Assurance',
      description: 'Ensuring all blood products meet the highest safety standards and regulatory requirements.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About LifeConnect</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Connecting donors with those in need through technology, compassion, and community.
              Every drop of blood donated through our platform helps save precious lives.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <Target className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To create a seamless bridge between blood donors and those in urgent need,
                utilizing cutting-edge technology to make blood donation more accessible,
                efficient, and impactful than ever before.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We strive to eliminate blood shortages by building a robust network of
                dedicated donors and healthcare partners committed to saving lives together.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                A world where no life is lost due to blood shortage. We envision a future
                where finding compatible blood donors is as simple as a few taps on a smartphone.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through innovation, education, and community engagement, we aim to create
                the world's most trusted and efficient blood donation platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These numbers represent the lives we've touched and the communities we've served
              through our blood donation platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ number, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">{number}</div>
                  <div className="text-gray-600 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at LifeConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <FeatureCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals working tirelessly to make blood donation
              more accessible and efficient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                {/* Avatar Placeholder */}
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-gray-500" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-red-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          </div>

          <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
            <p>
              LifeConnect was born out of a simple yet powerful observation: in critical moments
              when blood is urgently needed, finding compatible donors shouldn't be a race against time
              filled with uncertainty and desperation.
            </p>

            <p>
              Founded in 2023 by a team of healthcare professionals and technology enthusiasts,
              our platform emerged from the realization that technology could dramatically improve
              the blood donation ecosystem. We witnessed firsthand how families struggled to find
              blood donors during medical emergencies, often relying on social media posts and
              word-of-mouth in their most desperate hours.
            </p>

            <p>
              Today, LifeConnect has grown into a comprehensive platform that not only connects
              donors with recipients but also educates communities about blood donation, maintains
              safety standards, and provides 24/7 support for emergency blood requests.
            </p>

            <p>
              Every success story, every life saved through our platform, reinforces our commitment
              to this mission. We're not just a technology company – we're a community of people
              who believe that together, we can ensure no life is lost due to blood shortage.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Handshake className="h-16 w-16 text-white mx-auto mb-6" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Whether you're a donor, healthcare provider, or someone who believes in our cause,
            there's a place for you in the LifeConnect community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Heart className="h-5 w-5 mr-2" />
              Become a Donor
            </Button>
            <Button variant="outline" size="lg">
              Partner with Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}