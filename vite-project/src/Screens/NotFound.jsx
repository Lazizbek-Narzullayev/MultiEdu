import React from "react";
import { Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        padding: "1rem",
      }}
    >
      <Paper
        elevation={6}
        style={{
          padding: "3rem",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "5rem", marginBottom: "1rem", fontWeight: "bold" }}>
          404
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
          Oops! Page not found.
        </p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
          sx={{
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: "8px",
            background: "linear-gradient(to right, #16222A, #3A6073)",
            "&:hover": {
              background: "linear-gradient(to right, #0f2027, #2c5364)",
            },
          }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </div>
  );
};

export default NotFound;
