'use client';

import { Typography, Container, Grid, Box } from '@mui/material';
import { ArrowForward, People, Security, Speed, Support } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultDashboardPath } from '@/lib/authUtils';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleAuthAction = (action: 'login' | 'register') => {
    // If user is already authenticated, redirect to their dashboard
    if (isAuthenticated && user?.role) {
      const dashboardPath = getDefaultDashboardPath(user.role);
      router.push(dashboardPath);
    } else {
      // Otherwise, go to the requested auth page
      router.push(`/${action}`);
    }
  };

  const features = [
    {
      icon: People,
      title: 'Connect People',
      description: 'Build meaningful relationships and expand your network with like-minded individuals.',
    },
    {
      icon: Security,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy measures.',
    },
    {
      icon: Speed,
      title: 'Fast & Reliable',
      description: 'Experience lightning-fast performance with 99.9% uptime guaranteed.',
    },
    {
      icon: Support,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={cn(
        'relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
        'py-20 overflow-hidden'
      )}>
        <Container maxWidth="lg">
          <div className="text-center space-y-8">
            <Typography 
              variant="h1" 
              className={cn(
                'text-4xl md:text-6xl font-bold text-gray-800 mb-6',
                'animate-slide-up'
              )}
            >
              Connect. Share.{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Grow.
              </span>
            </Typography>
            
            <Typography 
              variant="h5" 
              className={cn(
                'text-gray-600 max-w-2xl mx-auto leading-relaxed',
                'animate-slide-up delay-200'
              )}
            >
              Join LifeConnect and discover a new way to build meaningful relationships, 
              share experiences, and grow together in a supportive community.
            </Typography>
            
            <div className={cn(
              'flex flex-col sm:flex-row gap-4 justify-center mt-8',
              'animate-slide-up delay-300'
            )}>
              <Button 
                variant="primary" 
                size="lg" 
                className="group"
                onClick={() => handleAuthAction('register')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Today'}
                <ArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleAuthAction('login')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
              </Button>
            </div>
          </div>
        </Container>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-gray-800 font-bold mb-4">
              Why Choose LifeConnect?
            </Typography>
            <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
              Discover the features that make LifeConnect the perfect platform for 
              building lasting connections and meaningful relationships.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div key={title}>
                <Card 
                  hover 
                  className={cn(
                    'h-full text-center group',
                    'animate-slide-up',
                    `delay-[${index * 100}ms]`
                  )}
                >
                  <CardBody className="space-y-4">
                    <div className={cn(
                      'w-16 h-16 bg-gradient-primary rounded-2xl',
                      'flex items-center justify-center mx-auto',
                      'group-hover:scale-110 transition-transform duration-300'
                    )}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    
                    <Typography variant="h6" className="font-semibold text-gray-800">
                      {title}
                    </Typography>
                    
                    <Typography variant="body2" className="text-gray-600 leading-relaxed">
                      {description}
                    </Typography>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={cn(
        'py-20 bg-gradient-to-r from-primary-600 to-secondary-600',
        'text-white text-center'
      )}>
        <Container maxWidth="md">
          <Typography variant="h2" className="font-bold mb-4">
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" className="mb-8 opacity-90">
            Join thousands of users who are already connecting and growing with LifeConnect.
          </Typography>
          <Button 
            variant="secondary" 
            size="lg" 
            className={cn(
              'bg-white text-primary-600 hover:bg-gray-50',
              'hover:shadow-2xl hover:scale-105'
            )}
            onClick={() => handleAuthAction('register')}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Create Your Free Account'}
          </Button>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <Container maxWidth="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '500+', label: 'Communities' },
              { number: '1M+', label: 'Connections Made' },
              { number: '99.9%', label: 'Uptime' },
            ].map(({ number, label }) => (
              <div key={label}>
                <Typography variant="h3" className="font-bold text-primary-600 mb-2">
                  {number}
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  {label}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
