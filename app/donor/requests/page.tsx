"use client";

import { useEffect, useState } from "react";
import { Typography, Paper, Button } from "@mui/material";
import api from "@/lib/api";
import axios from "axios";

interface Request {
    id: number;
    hospital: string;
    bloodType: string;
    status: string;
    createdAt: string;
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);


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
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/donors/requests");
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setRequests([]);
        }
    };

    // const handleAccept = async (req: Request) => {
    //     try {
    //         setLoading(true);

    //         await api.patch(`/donors/requests/${req.id}/accept`);

    //         await api.post("/donors/history", {
    //             requestId: req.id,
    //             hospital: req.hospital,
    //             bloodType: req.bloodType,
    //             donatedAt: new Date().toISOString(),
    //         });

    //         setRequests((prev) => prev.filter((r) => r.id !== req.id));

    //         alert(`✅ Request for ${req.id} accepted and added to your history.`);
    //     } catch (err) {
    //         console.error("Error accepting request:", err);
    //         alert("❌ Failed to accept request. Try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <Paper className="p-6">
            <Typography variant="h4" gutterBottom>
                Active Blood Requests
            </Typography>
            {requests.length === 0 ? (
                <p>No active requests.</p>
            ) : (
                requests.map((req) => (
                    <div
                        key={req.id}
                        className="border-b py-3 flex justify-between items-center"
                    >
                        <div>

                            <p>Blood Group : {req.bloodType}</p>
                            <p>Status: {req.status}</p>
                            <p>📅Created at:  {new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>

                    </div>
                ))
            )}
        </Paper>
    );
}
