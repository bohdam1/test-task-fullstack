import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper, Stack, Alert } from "@mui/material";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/login");
    }
  }, [status, navigate]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Ім'я має містити щонайменше 2 символи")
      .required("Ім'я обов'язкове"),
    email: Yup.string()
      .email("Невірна електронна адреса")
      .required("Електронна пошта обов'язкова"),
    password: Yup.string()
      .min(6, "Пароль має містити щонайменше 6 символів")
      .required("Пароль обов'язковий"),
  });

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}
    >
      <Typography variant="h5" component="h2" textAlign="center" mb={3}>
        Реєстрація
      </Typography>

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await dispatch(registerUser(values));
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={2}>
              <Field
                as={TextField}
                name="name"
                label="Ім'я"
                fullWidth
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name="name" />}
              />
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
                {status === "loading" ? "Реєстрація..." : "Зареєструватися"}
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
        Вже маєте акаунт? <Link to="/login">Увійти</Link>
      </Typography>
    </Paper>
  );
};

export default Register;
