"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Paper } from "@mui/material";
import api from "@/lib/api";

interface Donation {
    id: number;
    date: string;
    hospital: string;
    units: number;
}

export default function HistoryPage() {
    const params = useParams();
    const id = params?.id as string;
    const [history, setHistory] = useState<Donation[]>([]);

    useEffect(() => {
        if (!id) return;
        api.get(`/donors/${id}/history`).then((res) => setHistory(res.data));
    }, [id]);

    return (
        <Paper className="p-6">
            <Typography variant="h4">Donation History</Typography>
            {history.length === 0 ? (
                <p>No donations yet.</p>
            ) : (
                history.map((d) => (
                    <div key={d.id} className="border-b py-2">
                        🏥 {d.hospital} — {d.units} units on{" "}
                        {new Date(d.date).toLocaleDateString()}
                    </div>
                ))
            )}
        </Paper>
    );
}
