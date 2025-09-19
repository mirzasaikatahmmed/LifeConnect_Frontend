"use client";

import { Typography, Paper, Grid, Button } from "@mui/material";
import Link from "next/link";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        api.get("/donors/profile")
            .then((res) => setProfile(res.data))
            .catch(() => setProfile(null));
    }, []);

    return (
        <div className="flex flex-col items-center">
            <Typography variant="h4" gutterBottom className="font-bold text-primary mb-6">
                Dashboard
            </Typography>

            <Paper className="p-8 w-full max-w-3xl text-center shadow-lg rounded-2xl">
                <Typography variant="h5" className="mb-2">
                    Welcome 👋
                </Typography>
                <Typography variant="h6" className="mb-6 font-semibold text-gray-700">
                    {profile?.name || "Donor"}
                </Typography>

                <Typography variant="body2" className="mb-6 text-gray-500">
                    Access your donor options below:
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Link href="/donor/history">
                            <Button
                                variant="contained"
                                fullWidth
                                className="rounded-xl shadow-md"
                            >
                                History
                            </Button>
                        </Link>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Link href="/donor/profile">
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                className="rounded-xl shadow-md"
                            >
                                Profile
                            </Button>
                        </Link>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Link href="/donor/requests">
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                className="rounded-xl shadow-md"
                            >
                                Requests
                            </Button>
                        </Link>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Link href="/donor/donors">
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                className="rounded-xl shadow-md"
                            >
                                View Donors
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </div>

    );
}
