import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { getProfile, updateProfile } from "../store/userSlice";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleUpdate = () => {
    const data: any = {};
    if (name !== profile?.name) data.name = name;
    if (email !== profile?.email) data.email = email;
    if (password.trim()) data.password = password;

    dispatch(updateProfile(data));
    setPassword("");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Назад
      </Button>

      <Typography variant="h5" mt={2}>
        Профіль
      </Typography>

      {error && <Typography color="error">{error}</Typography>}
      {status === "loading" && <Typography>Завантаження...</Typography>}

      <Box mt={2}>
        <TextField
          fullWidth
          label="Ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          sx={{ mt: 1 }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Новий пароль"
          value={password}
          sx={{ mt: 1 }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleUpdate}>
          Оновити
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
