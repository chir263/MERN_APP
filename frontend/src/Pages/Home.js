import React from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
const theme = createTheme();

export default function Home() {
  const [signup, setSignup] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            // height: "inherit",
            backgroundImage:
              "url(https://images.hdqwalls.com/download/reddit-cartoon-4k-io-1920x1080.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          elevation={6}
          component={Paper}
        >
          {signup ? <SignUp /> : ""}
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={4}
          component={Paper}
          elevation={6}
          square
          backgroundColor="#00eedd"
        >
          <Login setSignup={setSignup} signup={signup} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
