import React from "react";
import Link from "next/link"; // Next.js Link
import { Heart, Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LifeBlood</span>
            </div>
            <p className="text-gray-400">
              Connecting donors with those in need, saving lives one donation at
              a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white transition-colors">
                  How to Donate
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="hover:text-white transition-colors">
                  Eligibility
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/blood-drives" className="hover:text-white transition-colors">
                  Blood Drives
                </Link>
              </li>
              <li>
                <Link href="/emergency-requests" className="hover:text-white transition-colors">
                  Emergency Requests
                </Link>
              </li>
              <li>
                <Link href="/health-screening" className="hover:text-white transition-colors">
                  Health Screening
                </Link>
              </li>
              <li>
                <Link href="/donor-rewards" className="hover:text-white transition-colors">
                  Donor Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
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

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 LifeBlood. All rights reserved. Saving lives together.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
