"use client";

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    CircularProgress,
    TextField,
    Alert,
    InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, User, Phone, Droplets, Edit3 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface DonorProfile {
    name: string;
    bloodType: string;
    phoneNumber: string;
    email: string;
}

const ProfilePage = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState<DonorProfile | null>(null);
    const [formData, setFormData] = useState<DonorProfile>({
        name: '',
        bloodType: '',
        phoneNumber: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('lifeconnect-secret-key');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const headers = { Authorization: `Bearer ${token}` };

                //Fetch donor profile
                const response = await axios.get<DonorProfile>(`${API_BASE_URL}/donors/profile`, { headers });
                setProfileData(response.data);
                setFormData(response.data);
                setIsLoading(false);
            } catch (err: any) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile data. Please try again.");
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!formData.name.trim()) {
            errors.name = 'Name is required.';
        }
        if (!/^\d{11}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be a valid 11-digit number.';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Axios PATCH request
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem('lifeconnect-secret-key');
            const headers = { Authorization: `Bearer ${token}` };

            //Update donor profile
            await axios.patch(`${API_BASE_URL}/donors/profile`, formData, { headers });

            setProfileData(formData);
            setIsEditing(false);
            setSuccessMessage("Profile updated successfully!");

        } catch (err: any) {
            console.error("Failed to update profile:", err);
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return (
            <Container className="flex justify-center items-center h-screen bg-white">
                <CircularProgress />
            </Container>
        );
    }

    if (error && !isEditing) {
        return (
            <Container className="p-8 bg-white flex flex-col items-center justify-center">
                <Alert severity="error">{error}</Alert>
                <div className="flex justify-center mt-4">
                    <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} className="py-8 bg-white min-h-screen flex items-center justify-center">
            <Container maxWidth="md">
                <Card className="p-8 shadow-2xl rounded-xl">
                    <CardContent>
                        <Box className="flex flex-col md:flex-row items-center justify-between mb-8">
                            <Typography variant="h4" component="h1" className="font-bold text-gray-800">
                                {isEditing ? "Update Your Profile" : "Donor Profile"}
                            </Typography>
                            {!isEditing && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setIsEditing(true)}
                                    startIcon={<Edit3 size={18} />}
                                    className="bg-red-500 hover:bg-red-600 transition-colors mt-4 md:mt-0"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Box>

                        {successMessage && <Alert severity="success" className="mb-4">{successMessage}</Alert>}
                        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                        {!isEditing ? (
                            //current profile information
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Box className="flex items-center space-x-4 p-4 rounded-lg border-b border-gray-200">
                                        <User className="text-red-500" size={24} />
                                        <div>
                                            <Typography variant="h6" className="text-gray-600">Name</Typography>
                                            <Typography variant="body1" className="text-lg font-medium text-gray-800">{profileData?.name}</Typography>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="flex items-center space-x-4 p-4 rounded-lg border-b border-gray-200">
                                        <Mail className="text-red-500" size={24} />
                                        <div>
                                            <Typography variant="h6" className="text-gray-600">Email</Typography>
                                            <Typography variant="body1" className="text-lg font-medium text-gray-800">{profileData?.email}</Typography>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="flex items-center space-x-4 p-4 rounded-lg border-b border-gray-200">
                                        <Phone className="text-red-500" size={24} />
                                        <div>
                                            <Typography variant="h6" className="text-gray-600">Phone Number</Typography>
                                            <Typography variant="body1" className="text-lg font-medium text-gray-800">{profileData?.phoneNumber}</Typography>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="flex items-center space-x-4 p-4 rounded-lg border-b border-gray-200">
                                        <Droplets className="text-red-500" size={24} />
                                        <div>
                                            <Typography variant="h6" className="text-gray-600">Blood Type</Typography>
                                            <Typography variant="body1" className="text-lg font-medium text-gray-800">{profileData?.bloodType}</Typography>
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            // update profile form
                            <form onSubmit={handleUpdate}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!validationErrors.name}
                                            helperText={validationErrors.name}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><User size={20} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Email (Cannot be changed)"
                                            name="email"
                                            value={formData.email}
                                            fullWidth
                                            disabled
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Mail size={20} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Phone Number"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={!!validationErrors.phoneNumber}
                                            helperText={validationErrors.phoneNumber}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Phone size={20} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Blood Type"
                                            name="bloodType"
                                            value={formData.bloodType}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Droplets size={20} className="text-gray-500" /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Box className="flex justify-end space-x-4 mt-6">
                                    <Button variant="text" onClick={() => setIsEditing(false)} className="text-gray-600 hover:bg-gray-100">
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary" className="bg-red-500 hover:bg-red-600 transition-colors">
                                        Save Changes
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Container>
    );
};

export default ProfilePage;