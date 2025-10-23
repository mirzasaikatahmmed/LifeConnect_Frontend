"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
} from "@mui/material";
import axios from "axios";

interface Donor {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    bloodType: string;
    lastDonationDate?: string;
}

export default function DonorsPage() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const api = axios.create({
        baseURL: "https://lifeconnect-backend.saikat.com.bd",
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await api.get("/donors/profiles");
                setDonors(res.data);
            } catch (err: any) {
                console.error("Failed to fetch donors:", err.response?.data || err.message);
                alert("Failed to load donors. Please login again.");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
                <Typography className="ml-4">Loading donors...</Typography>
            </div>
        );
    }

    return (
        <Paper className="p-6">
            <Typography variant="h4" gutterBottom>
                All Donors
            </Typography>

            {donors.length === 0 ? (
                <Typography>No donors found.</Typography>
            ) : (
                <TableContainer component={Paper} className="mt-4">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>Phone</b></TableCell>
                                <TableCell><b>Blood Type</b></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {donors.map((donor) => (
                                <TableRow key={donor.id}>
                                    <TableCell>{donor.name}</TableCell>
                                    <TableCell>{donor.email}</TableCell>
                                    <TableCell>{donor.phoneNumber}</TableCell>
                                    <TableCell>{donor.bloodType}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}
