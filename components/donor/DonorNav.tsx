"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";

export default function DonorNav() {
    const { logout } = useAuth();

    return (
        <AppBar position="static" className="mb-6" sx={{ backgroundColor: "red" }}>
            <Toolbar className="container mx-auto flex justify-between">

                <Box sx={{ flex: 1 }} />

                <Typography variant="h6" component="div" sx={{ flex: 1, textAlign: "center" }}>
                    DONOR PART
                </Typography>

                <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                </Box>

            </Toolbar>
        </AppBar>


    );
}
