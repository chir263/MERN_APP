import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login_Avatar from "../media/login/download.png";
import { API_URL } from "../API_URL";
// import { alpha } from "@material-ui/core/styles/colorManipulator";
// import Color from "color";

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState("Error");
  const [formValues, setFormValues] = useState({
    firstname: {
      value: "",
      error: false,
    },
    lastname: {
      value: "",
      error: false,
    },
    email: {
      value: "",
      error: false,
    },
    age: {
      value: "",
      error: false,
    },
    phone: {
      value: "",
      error: false,
    },
    username: {
      value: "",
      error: false,
    },
    password: {
      value: "",
      error: false,
    },
  });
  const [disable, setDisable] = useState(true);
  const handleChange = (e) => {
    if (
      formValues.firstname.value === "" ||
      formValues.lastname.value === "" ||
      formValues.email.value === "" ||
      formValues.age.value === "" ||
      formValues.phone.value === "" ||
      formValues.username.value === "" ||
      formValues.password.value === ""
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
    const { name, value } = e.target;
    if (name === "phone") {
      if (
        (!Number.isInteger(parseInt(value)) && value !== "") ||
        value.length > 10
      ) {
        return;
      }
    }
    if (name === "age") {
      if (
        (!Number.isInteger(parseInt(value)) && value !== "") ||
        parseInt(value) > 120
      ) {
        return;
      }
    }
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formFields = Object.keys(formValues);
    let newFormValues = { ...formValues };
    let error_happened = false;

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
        } else {
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
        let body = {
          first_name: formValues.firstname.value,
          last_name: formValues.lastname.value,
          user_name: formValues.username.value,
          email: formValues.email.value,
          age: formValues.age.value,
          contact_number: formValues.phone.value,
          password: formValues.password.value,
        };
        const resp = await axios.post(API_URL + "/auth/register", body);
        if (resp.status === 201) {
          setAlert(false);
          setAlertMessage("");
          localStorage.setItem(
            "greddit_user_loggedin",
            JSON.stringify(resp.data)
          );
          navigate("/dashboard/profile");
        }
      } catch (err) {
        setAlert(true);
        setAlertMessage(`${err.response.status}:${err.response.data.msg}`);
        setTimeout(() => {
          setAlert(false);
        }, 10000);
      }
    }
    setFormValues(newFormValues);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(0,211,194,0.95)",
            paddingBlockEnd: 2,
            paddingInline: 3,
            borderRadius: "20px",
            // backgroundColor: Color(theme.colors.red).alpha(0.5).string(),
            // backgroundColor: theme.utils.rgba(theme.axColor.black, 0.7),
          }}
        >
          <Avatar
            alt="Avatar"
            src={Login_Avatar}
            sx={{ width: 150, height: 150 }}
          />
          <Typography component="h1" variant="h4" color="#00886f">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            onChange={handleChange}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstname"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  variant="filled"
                  autoFocus
                  value={formValues.firstname.value}
                  error={formValues.firstname.error}
                  helperText={formValues.firstname.helperText}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="family-name"
                  variant="filled"
                  value={formValues.lastname.value}
                  error={formValues.lastname.error}
                  helperText={formValues.lastname.helperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  variant="filled"
                  value={formValues.email.value}
                  error={formValues.email.error}
                  helperText={formValues.email.helperText}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  type="age"
                  id="age"
                  autoComplete="age-age"
                  variant="filled"
                  value={formValues.age.value}
                  error={formValues.age.error}
                  helperText={formValues.age.helperText}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Contact number"
                  type="phone"
                  id="phone"
                  autoComplete="phone-phone"
                  variant="filled"
                  value={formValues.phone.value}
                  error={formValues.phone.error}
                  helperText={formValues.phone.helperText}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Username"
                  type="username"
                  id="username"
                  autoComplete="new-password"
                  variant="filled"
                  value={formValues.username.value}
                  error={formValues.username.error}
                  helperText={formValues.username.helperText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="user-name"
                  variant="filled"
                  value={formValues.password.value}
                  error={formValues.password.error}
                  helperText={formValues.password.helperText}
                />
              </Grid>
            </Grid>
            {alert && (
              <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                {alertmessage}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              disabled={disable}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end"></Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
