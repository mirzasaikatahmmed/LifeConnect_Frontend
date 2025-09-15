"use client";

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Droplets, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Donation {
    id: string;
    centerName: string;
    units: number;
    donationDate: string;
}

const DonationHistoryPage = () => {
    const router = useRouter();
    const [donationHistory, setDonationHistory] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('lifeconnect-secret-key');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.get<Donation[]>(`${API_BASE_URL}/donors/history`, { headers });
                setDonationHistory(response.data);
                setIsLoading(false);
            } catch (err: any) {
                console.error("Failed to fetch donation history:", err);
                setError("Failed to load donation history. Please try again.");
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <CircularProgress color="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="p-4 bg-white flex flex-col items-center justify-center min-h-screen">
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="py-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Donation History</h1>

            <Card className="shadow-lg rounded-xl">
                <CardContent>
                    {donationHistory.length > 0 ? (
                        <TableContainer component={Paper} className="shadow-none">
                            <Table aria-label="Donation History Table">
                                <TableHead className="bg-red-50">
                                    <TableRow>
                                        <TableCell className="text-red-800 font-semibold flex items-center space-x-2">
                                            <Calendar size={18} /> <span>Date</span>
                                        </TableCell>
                                        <TableCell className="text-red-800 font-semibold flex items-center space-x-2">
                                            <MapPin size={18} /> <span>Donation Center</span>
                                        </TableCell>
                                        <TableCell align="right" className="text-red-800 font-semibold flex items-center space-x-2 justify-end">
                                            <Droplets size={18} /> <span>Units Donated</span>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {donationHistory.map((donation) => (
                                        <TableRow key={donation.id} className="hover:bg-gray-100 transition-colors">
                                            <TableCell className="text-gray-800">{donation.donationDate}</TableCell>
                                            <TableCell className="text-gray-800">{donation.centerName}</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${donation.units} unit${donation.units > 1 ? 's' : ''}`}
                                                    className="bg-red-500 text-white font-medium"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box className="flex flex-col items-center justify-center text-center p-12 space-y-4">
                            <HeartHandshake className="text-gray-400" size={64} />
                            <Typography variant="h5" className="text-gray-600 font-semibold">
                                No donations recorded yet!
                            </Typography>
                            <Typography variant="body1" className="text-gray-500 max-w-sm">
                                It looks like you haven't made any donations yet. Once you do, they will appear here.
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default DonationHistoryPage;