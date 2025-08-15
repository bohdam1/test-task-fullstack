import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdById, updateAd, deleteAd } from "../store/adsSlice";
import { getProfile } from "../store/userSlice";
import { RootState } from "../store/store";
import { CircularProgress, Typography, TextField, Button, Box } from "@mui/material";
import Slider from "react-slick";

const AdDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { currentAd, loading } = useSelector((state: RootState) => state.ads);
  const { profile, status: profileStatus } = useSelector((state: RootState) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  // Завантажуємо профіль, якщо ще не отриманий
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Завантажуємо оголошення
  useEffect(() => {
    if (id) dispatch(fetchAdById(id));
  }, [id, dispatch]);

  // Синхронізуємо поля при зміні оголошення
  useEffect(() => {
    if (currentAd) {
      setTitle(currentAd.title || "");
      setDescription(currentAd.description || "");
      setCity(currentAd.city || "");
      setPrice(currentAd.price?.toString() || "");
      setExistingImages(currentAd.images || []);
      setNewImages([]);
    }
  }, [currentAd]);

  // Визначаємо, чи користувач власник оголошення
  useEffect(() => {
    if (profile && currentAd) {
      setIsOwner(profile.id === currentAd.userId);
    }
  }, [profile, currentAd]);

  const handleImageRemove = (index: number) =>
    setExistingImages(prev => prev.filter((_, i) => i !== index));

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  // явне приведення до масиву File[]
  const filesArray = Array.from(files) as File[];
  setNewImages(prev => [...prev, ...filesArray]);
};

  const handleNewImageRemove = (index: number) =>
    setNewImages(prev => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!id) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("city", city);
    formData.append("price", price);

    // Нові файли
    newImages.forEach(file => formData.append("images", file));
    // Старі зображення
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      await dispatch(updateAd({ id, formData })).unwrap();
      setIsEditing(false);
      setNewImages([]);
      dispatch(fetchAdById(id));
    } catch (error) {
      console.error("Помилка при збереженні:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Ви впевнені, що хочете видалити це оголошення?")) return;
    try {
      await dispatch(deleteAd(id)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  if (loading || profileStatus === "loading")
    return <CircularProgress sx={{ display: "block", m: "50px auto" }} />;

  if (!currentAd) return <Typography align="center">Оголошення не знайдено</Typography>;

  const sliderSettings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, arrows: true };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} maxWidth="800px" mx="auto">
      <Box mb={2} width="100%">
        <Button variant="outlined" onClick={() => navigate(-1)}>Назад</Button>
      </Box>

      {!isEditing ? (
        <>
          <Typography variant="h4" align="center">{currentAd.title}</Typography>

          {currentAd.images?.length > 0 && (
            <Box mt={2} width="400px">
              <Slider {...sliderSettings}>
                {currentAd.images.map((img, idx) => (
                  <Box key={idx} display="flex" justifyContent="center">
                    <img
                      src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                      alt={`${currentAd.title} ${idx + 1}`}
                      style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: 8 }}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          )}

          <Typography align="center" mt={2}>{currentAd.description}</Typography>
          <Typography variant="h6" align="center" mt={1}>{currentAd.city} — ${currentAd.price}</Typography>

          {isOwner && (
            <Box mt={2} display="flex" gap={1} justifyContent="center">
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>Редагувати</Button>
              <Button variant="contained" color="error" onClick={handleDelete}>Видалити</Button>
            </Box>
          )}
        </>
      ) : (
        <>
          <TextField label="Заголовок" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} />
          <TextField label="Опис" fullWidth multiline rows={4} margin="normal" value={description} onChange={e => setDescription(e.target.value)} />
          <TextField label="Місто" fullWidth margin="normal" value={city} onChange={e => setCity(e.target.value)} />
          <TextField label="Ціна" fullWidth margin="normal" type="number" value={price} onChange={e => setPrice(e.target.value)} />

          <Typography variant="subtitle1" mt={2}>Існуючі зображення:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {existingImages.map((img, idx) => (
              <Box key={idx} position="relative">
                <img
                  src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                  alt={`існуюче-${idx}`}
                  style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 4 }}
                />
                <button
                  style={{
                    position: "absolute", top: -8, right: -8, background: "red",
                    color: "white", borderRadius: "50%", border: "none", width: 20, height: 20, cursor: "pointer"
                  }}
                  onClick={() => handleImageRemove(idx)}
                >
                  ×
                </button>
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle1">Додати нові зображення:</Typography>
          <input type="file" multiple accept="image/*" onChange={handleNewImagesChange} />
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {newImages.map((file, idx) => (
              <Box key={idx} position="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 4 }}
                />
                <button
                  style={{
                    position: "absolute", top: -8, right: -8,
                    color: "white", borderRadius: "50%", border: "none", width: 20, height: 20, cursor: "pointer"
                  }}
                  onClick={() => handleNewImageRemove(idx)}
                >
                  ×
                </button>
              </Box>
            ))}
          </Box>

          <Box mt={2} display="flex" gap={1}>
            <Button variant="contained" color="primary" onClick={handleSave}>Зберегти</Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>Скасувати</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdDetails;
