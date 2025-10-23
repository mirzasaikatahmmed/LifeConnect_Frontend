"use client";

import { useEffect, useState } from "react";
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import api from "@/lib/api";

interface DonationHistory {
    id: number;
    centerName: string;
    units: number;
    donatedAt: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<DonationHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/donors/history")
            .then((res) => setHistory(res.data))
            .catch(() => setHistory([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Typography>Loading donation history...</Typography>;
    }

    if (history.length === 0) {
        return (
            <Paper className="p-6">
                <Typography variant="h6">No donation history found.</Typography>
            </Paper>
        );
    }

    return (
        <Paper className="p-6">
            <Typography variant="h5" gutterBottom>
                My Donation History
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Donation ID</TableCell>
                        <TableCell>Center Name</TableCell>
                        <TableCell>Units Donated</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history.map((donation) => (
                        <TableRow key={donation.id}>
                            <TableCell>{donation.id}</TableCell>
                            <TableCell>{donation.centerName}</TableCell>
                            <TableCell>{donation.units}</TableCell>
                            <TableCell>
                                {new Date(donation.donatedAt).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
