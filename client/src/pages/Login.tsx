import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { accessToken, status, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Невірна електронна адреса").required("Електронна пошта обов'язкова"),
    password: Yup.string()
      .min(6, "Пароль повинен містити щонайменше 6 символів")
      .required("Пароль обов'язковий"),
  });

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
      }}
    >
      <Typography variant="h5" component="h2" textAlign="center" mb={3}>
        Вхід
      </Typography>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await dispatch(loginUser(values));
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={2}>
              <Field
                as={TextField}
                name="email"
                label="Електронна пошта"
                fullWidth
                error={touched.email && Boolean(errors.email)}
                helperText={<ErrorMessage name="email" />}
              />
              <Field
                as={TextField}
                name="password"
                label="Пароль"
                type="password"
                fullWidth
                error={touched.password && Boolean(errors.password)}
                helperText={<ErrorMessage name="password" />}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || status === "loading"}
              >
                {status === "loading" ? "Вхід..." : "Увійти"}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      {status === "failed" && error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" textAlign="center" mt={2}>
        Ще не маєте акаунта? <Link to="/register">Зареєструйтесь тут</Link>
      </Typography>
    </Paper>
  );
};

export default Login;
