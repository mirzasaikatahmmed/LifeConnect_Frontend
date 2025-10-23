"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography, Paper, TextField, Button, CircularProgress } from "@mui/material";
import axios from "axios";

interface ProfileData {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    bloodType: string;
}

export default function ProfileByIdPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

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
        if (!id) return;

        const fetchProfile = async () => {
            try {
                const res = await api.get(`/donors/${id}/profile`);
                setProfile(res.data);
            } catch (err: any) {
                console.error("Failed to fetch profile:", err.response?.data || err.message);
                alert("Failed to load profile. Please login or check ID.");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const handleUpdate = async (updatedData: any) => {
        try {
            const res = await api.patch("/donors/profile", updatedData);
            console.log("Update successful:", res.data);
            alert("Profile updated successfully!");
        } catch (err: any) {
            console.error("Update failed:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            alert(`❌ Update failed: ${err.response?.data?.message || err.message}`);
        }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center p-12">
                <CircularProgress />
                <Typography className="ml-4">Loading profile...</Typography>
            </div>
        );
    }

    if (!profile) {
        return (
            <Typography color="error" className="p-6">
                Failed to load profile.
            </Typography>
        );
    }

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        throw new Error("Function not implemented.");
    }

    return (
        <Paper className="p-6 max-w-md mx-auto">
            <Typography variant="h5" gutterBottom>
                Donor Profile (ID: {profile.id})
            </Typography>

            <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
            />

            <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={profile.email}
                disabled
            />

            <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
            />


            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                fullWidth
                disabled={updating}
                sx={{ mt: 2 }}
            >
                {updating ? "Updating..." : "Save Changes"}
            </Button>
        </Paper>
    );
}
