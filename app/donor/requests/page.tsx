import React from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Alert,
    Grid,
    Chip,
    Button
} from '@mui/material';
import axios from 'axios';
import { Hospital, Syringe, Clock, Calendar, Droplets } from 'lucide-react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface BloodRequest {
    id: string;
    bloodType: string;
    hospitalName: string;
    urgencyLevel: string;
    neededBy: string;
}

interface BloodRequestsPageProps {
    bloodRequests: BloodRequest[];
    error?: string;
}

const BloodRequestsPage: React.FC<BloodRequestsPageProps> = ({ bloodRequests, error }) => {
    if (error) {
        return (
            <Container className="p-4 bg-white flex flex-col items-center justify-center min-h-screen">
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="py-8 bg-white min-h-screen">
            <Box className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Nearby Blood Requests</h1>
                <p className="text-gray-500 mt-2">See urgent needs in your area and help save a life.</p>
            </Box>

            <Grid container spacing={4} className="justify-center">
                {bloodRequests.length > 0 ? (
                    bloodRequests.map((request) => (
                        <Grid item xs={12} sm={6} md={4} key={request.id}>
                            <Card className="shadow-lg rounded-xl transition-all duration-300 hover:shadow-2xl">
                                <CardContent>
                                    <Box className="flex items-center space-x-4 mb-4">
                                        <Droplets className="text-red-500" size={32} />
                                        <Typography variant="h5" component="h2" className="font-bold text-gray-900">
                                            {request.bloodType}
                                        </Typography>
                                    </Box>
                                    <Box className="space-y-3">
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Hospital size={18} />
                                            <Typography variant="body1">{request.hospitalName}</Typography>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Clock size={18} />
                                            <Typography variant="body1">{request.neededBy}</Typography>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Syringe size={18} />
                                            <Typography variant="body1">
                                                <Chip
                                                    label={request.urgencyLevel}
                                                    className={`font-semibold ${request.urgencyLevel === 'Urgent' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'}`}
                                                />
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box className="mt-6">
                                        <Button
                                            component={Link}
                                            href={`/requests/${request.id}`}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            className="bg-red-500 hover:bg-red-600 transition-colors"
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box className="flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <Hospital className="text-gray-400" size={64} />
                        <Typography variant="h5" className="text-gray-600 font-semibold">
                            No urgent requests at this time.
                        </Typography>
                        <Typography variant="body1" className="text-gray-500 max-w-sm">
                            Thank you for checking! Please try again later.
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const cookies = parseCookies(context);
        const token = cookies['lifeconnect-secret-key'];

        if (!token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get<BloodRequest[]>(`${API_BASE_URL}/donors/requests`, { headers });

        return {
            props: {
                bloodRequests: response.data,
            },
        };
    } catch (err: any) {
        console.error("Failed to fetch blood requests:", err);
        return {
            props: {
                bloodRequests: [],
                error: "Failed to load blood requests. Please try again.",
            },
        };
    }
};

export default BloodRequestsPage;