import Button from "@/components/Home/Button";
import FeatureCard from "@/components/Home/Feature_Card";
import StatsCard from "@/components/Home/State";
import { Award, ChevronRight, Clock, Droplets, Heart, Mail, MapPin, Phone, Shield, Users } from "lucide-react";
import Navigation from "@/components/Home/Navigation";
import Footer from "@/components/Home/Footer";
import Link from "next/link";

const BloodDonationHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Save Lives,
                <span className="block text-red-200">Donate Blood</span>
              </h1>
              <p className="text-xl text-red-100 mb-8">
                Every donation can save up to 3 lives. Join our mission to ensure 
                no one suffers due to blood shortage. Your contribution matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Blood
                </Button>
                <Button variant="outline" size="lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Drive
                </Button>
              </div>
              <div className="mt-4 text-center sm:text-left">
                <p className="text-red-200 text-sm mb-2">New to LifeConnect?</p>
                <Button variant="outline" size="md" className="mr-3">
                  Sign Up as Donor
                </Button>
                <Link href="/login">
                <Button variant="secondary" size="md">
                  Sign In
                </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Image/Illustration */}
            <div className="flex justify-center">
              <div className="bg-red-800 bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <StatsCard
                    number="10K+"
                    label="Lives Saved"
                    icon={<Heart className="w-8 h-8 text-red-200" />}
                  />
                  <StatsCard
                    number="5K+"
                    label="Active Donors"
                    icon={<Users className="w-8 h-8 text-red-200" />}
                  />
                  <StatsCard
                    number="50+"
                    label="Donation Centers"
                    icon={<MapPin className="w-8 h-8 text-red-200" />}
                  />
                  <StatsCard
                    number="24/7"
                    label="Emergency Support"
                    icon={<Clock className="w-8 h-8 text-red-200" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LifeConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make blood donation simple, safe, and rewarding for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-red-600" />}
              title="Safe & Secure"
              description="All donations follow strict medical protocols with certified healthcare professionals"
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-red-600" />}
              title="Convenient Locations"
              description="Find donation centers near you or join our mobile blood drive events"
            />
            <FeatureCard
              icon={<Award className="w-6 h-6 text-red-600" />}
              title="Track Impact"
              description="See how your donations are making a difference in your community"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of heroes who donate blood regularly. Schedule your appointment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Droplets className="w-5 h-5 mr-2" />
              Schedule Donation
            </Button>
            <Button variant="outline" size="lg">
              Learn More
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-red-600 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">LifeBlood</span>
              </div>
              <p className="text-gray-400">
                Connecting donors with those in need, saving lives one donation at a time.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Donate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Eligibility</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blood Drives</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Requests</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Screening</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Donor Rewards</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>help@lifeblood.org</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>123 Health St, Medical City</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LifeBlood. All rights reserved. Saving lives together.</p>
          </div>
        </div>
      </footer> */}
      <Footer/>
    </div>
  );
};

export default BloodDonationHomepage;