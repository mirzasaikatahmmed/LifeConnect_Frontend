'use client';

import React, { useState, useEffect } from 'react';
import { Search, Phone, Filter, User, Heart } from 'lucide-react';
import Button from '@/components/Home/Button';
import axios from 'axios';

interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  contactNumber: string;
}

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function FindDonorPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, selectedBloodGroup, searchTerm]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/donors/public`);

      const data = response.data;

      // The API already returns filtered donor data
      setDonors(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError('Failed to fetch donor data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    // Filter by blood group
    if (selectedBloodGroup !== 'All') {
      filtered = filtered.filter(donor => donor.bloodGroup === selectedBloodGroup);
    }

    // Filter by search term (name)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(donor =>
        donor.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDonors(filtered);
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colors = {
      'A+': 'bg-red-500',
      'A-': 'bg-red-600',
      'B+': 'bg-blue-500',
      'B-': 'bg-blue-600',
      'AB+': 'bg-purple-500',
      'AB-': 'bg-purple-600',
      'O+': 'bg-green-500',
      'O-': 'bg-green-600',
    };
    return colors[bloodGroup as keyof typeof colors] || 'bg-gray-500';
  };

  const handleContactDonor = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Heart className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Donors</p>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDonors} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Blood Donors</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Connect with generous donors in your area. Every connection can save a life.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search donors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            {/* Blood Group Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500 h-5 w-5" />
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white min-w-[120px]"
              >
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group === 'All' ? 'All Blood Groups' : group}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-gray-600 font-medium">
              {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Donors Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDonors.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donors Found</h3>
              <p className="text-gray-600">
                {selectedBloodGroup !== 'All'
                  ? `No donors found for blood group ${selectedBloodGroup}.`
                  : 'No donors match your search criteria.'
                } Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-red-200"
                >
                  {/* Profile Image */}
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-10 w-10 text-gray-500" />
                      </div>
                      {/* Blood Group Badge */}
                      <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${getBloodGroupColor(donor.bloodGroup)} rounded-full flex items-center justify-center border-2 border-white`}>
                        <span className="text-white text-xs font-bold">
                          {donor.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Donor Details */}
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">
                      {donor.name}
                    </h3>

                    <div className="space-y-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${getBloodGroupColor(donor.bloodGroup)}`}>
                        Blood Group: {donor.bloodGroup}
                      </div>

                      {donor.contactNumber && (
                        <div className="flex items-center justify-center text-gray-600 text-sm">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{donor.contactNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Button */}
                  <div className="mt-6">
                    {donor.contactNumber ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleContactDonor(donor.contactNumber)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Donor
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full cursor-not-allowed opacity-50"
                        disabled
                      >
                        No Contact Info
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Become a Donor?
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Join our community of life-savers and help those in need.
          </p>
          <Button variant="secondary" size="lg">
            <Heart className="h-5 w-5 mr-2" />
            Register as Donor
          </Button>
        </div>
      </section>
    </div>
  );
}