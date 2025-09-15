"use client";

import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    Alert
} from '@mui/material';
import axios from 'axios';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface DonorProfile {
    name: string;
    bloodType: string;
    lastDonationDate?: string;
    totalDonations?: number;
}

interface BloodRequest {
    id: string;
    bloodType: string;
    hospitalName: string;
    urgencyLevel: string;
    neededBy: string;
}

const DonorDashboard = () => {
    const [profile, setProfile] = useState<DonorProfile | null>(null);
    const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Only run on client side to avoid hydration mismatch
                if (typeof window === 'undefined') return;

                const storedToken = localStorage.getItem('lifeconnect-secret-key');
                let token: string | null = null;

                if (storedToken) {
                    try {
                        const parsed = JSON.parse(storedToken);
                        token = parsed.token;
                    } catch (error) {
                        console.log("Token cannot be parsed from string");
                    }
                }

                if (!token) {
                    setError("Authentication token not found. Please log in.");
                    setIsLoading(false);
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                //Fetch donor profile info
                const profileRes = await axios.get(`${API_BASE_URL}/donors/profile`, { headers });
                setProfile(profileRes.data);

                //Fetch relevant blood requests
                const requestsRes = await axios.get(`${API_BASE_URL}/donors/requests`, { headers });
                setBloodRequests(requestsRes.data);

            } catch (err: any) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load dashboard data. Please check your connection and try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="p-4 bg-white">
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // Default values 
    const { name, bloodType, totalDonations = 0, lastDonationDate } = profile || {};

    return (

        <Container maxWidth={false} className="py-8 space-y-8 bg-white">
            <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
                    <CardContent>
                        <h2 className="text-xl font-semibold">Your Total Donations</h2>
                        <p className="text-4xl font-extrabold mt-2">{totalDonations}</p>
                        <p className="mt-2 text-sm opacity-80">Thank you for your life-saving contribution!</p>
                    </CardContent>
                </Card>

                <Card className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <CardContent>
                        <h2 className="text-xl font-semibold text-gray-800">Last Donation Date</h2>
                        <p className="text-2xl font-bold text-red-500 mt-2">
                            {lastDonationDate || 'Not recorded'}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">Keep track of your giving history.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <CardContent>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="flex flex-col space-y-3">
                            <Button
                                component={Link}
                                href="/donor/profile"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="bg-red-500 hover:bg-red-600 transition-colors"
                            >
                                View / Update Profile
                            </Button>
                            <Button
                                component={Link}
                                href="/donor/history"
                                variant="outlined"
                                color="primary"
                                fullWidth
                                className="text-red-500 border-red-500 hover:bg-red-50"
                            >
                                View Donation History
                            </Button>
                            <Button
                                component={Link}
                                href="/donor/requests"
                                variant="outlined"
                                color="primary"
                                fullWidth
                                className="text-red-500 border-red-500 hover:bg-red-50"
                            >
                                View Blood Requests
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <CardContent>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Blood Needs</h2>
                        {bloodRequests.length > 0 ? (
                            <List>
                                {bloodRequests.slice(0, 3).map((request) => (
                                    <ListItem key={request.id} disablePadding className="border-b last:border-b-0 py-2">
                                        <ListItemText
                                            primary={
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold">{request.hospitalName}</span>
                                                    <Chip
                                                        label={request.bloodType}
                                                        color="primary"
                                                        size="small"
                                                        className="bg-red-500 text-white"
                                                    />
                                                </div>
                                            }
                                            secondary={`Urgency: ${request.urgencyLevel} - Needed by ${request.neededBy}`}
                                        />
                                        <Link href={`/donor/requests/${request.id}`} className="text-blue-500 hover:underline text-sm">
                                            View
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <p className="text-gray-500 italic">No urgent requests matching your blood type at the moment.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
};

export default DonorDashboard;