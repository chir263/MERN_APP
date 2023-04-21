import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Login_Avatar from "../media/login/download.png";
import { API_URL } from "../API_URL";
import Loader from "./dashboard/components/loader/Loader";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Greddiit
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login({ setSignup, signup }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState("Error");
  const [disable, setDisable] = useState(true);
  const [formValues, setFormValues] = useState({
    login_username: {
      value: "",
      error: false,
    },
    login_password: {
      value: "",
      error: false,
    },
  });
  const [loader, setLoader] = useState(false);
  const handleChange_login = (e) => {
    const { name, value } = e.target;
    if (
      formValues.login_password.value === "" ||
      formValues.login_username.value === ""
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
      },
    });
  };

  const handleSubmit_login = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formFields = Object.keys(formValues);
    let newFormValues = { ...formValues };
    let error_happened = false;
    setDisable(!disable);
    const updateForm = (msg, show, val) => {
      for (let index = 0; index < formFields.length; index++) {
        const currentField = formFields[index];
        const currentValue = formValues[currentField].value;

        // empty
        if (currentValue === "" || val) {
          newFormValues = {
            ...newFormValues,
            [currentField]: {
              ...newFormValues[currentField],
              error: true,
              helperText: `${msg} ${show ? currentField : ""}`,
            },
          };
          error_happened = true;
          setDisable(true);
        } else {
          setDisable(false);
          newFormValues = {
            ...newFormValues,
            [currentField]: {
              ...newFormValues[currentField],
              error: false,
              helperText: ``,
            },
          };
        }
      }
    };
    updateForm("please enter ", true, false);
    // authenticate
    if (!error_happened) {
      try {
        const resp = await axios.post(API_URL + "/auth/login", {
          user_name: formValues.login_username.value,
          password: formValues.login_password.value,
        });
        if (resp.status === 200) {
          setAlert(false);
          setAlertMessage("");
          localStorage.setItem(
            "greddit_user_loggedin",
            JSON.stringify(resp.data)
          );
          setDisable(!disable);
          navigate("/dashboard/profile");
        }
        setLoader(false);
      } catch (err) {
        setDisable(false);
        setAlert(true);
        setAlertMessage(`${err.response.status}:${err.response.data.msg}`);
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        setLoader(false);
      }
    }
    setFormValues(newFormValues);
  };

  // const [dummy, setDummy] = useState("");
  // const chg = (e) => {
  //   setDummy(e.target.value);
  // };

  return (
    <>
      {loader && <Loader />}
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar
            alt="Avatar"
            src={Login_Avatar}
            sx={{ width: 70, height: 70 }}
          /> */}

            <img
              src={Login_Avatar}
              alt="avatar"
              style={{
                width: "40%",
                height: "40%",
                borderRadius: "50%",
              }}
            />
            <Typography component="h1" variant="h4" color="#00886f">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit_login}
              noValidate
              // sx={{ mt: 1 }}
              onChange={handleChange_login}
              sx={{ height: "100vh" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="login_username"
                label="User name"
                name="login_username"
                variant="filled"
                autoFocus
                value={formValues.login_username.value}
                error={formValues.login_username.error}
                helperText={formValues.login_username.helperText}
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="login_password"
                label="Password"
                type="password"
                id="login_password"
                variant="filled"
                value={formValues.login_password.value}
                error={formValues.login_password.error}
                helperText={formValues.login_password.helperText}
                autoComplete="off"
              />
              {alert && (
                <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                  {alertmessage}
                </Alert>
              )}

              {/* <input type="text" onChange={chg} value={dummy}></input> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={disable}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                  Forgot login_password?
                </Link> */}
                </Grid>
                <Grid item>
                  <Link
                    onClick={() => setSignup(!signup)}
                    style={{ cursor: "pointer" }}
                    variant="body2"
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
