import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingScreen: React.FC = () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
    </Box>
);

export default LoadingScreen;
