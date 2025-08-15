import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAds } from "../store/adsSlice";
import { RootState } from "../store/store";
import CreateAdForm from "../components/CreateAdForm/CreateAdForm";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";

const categories = ["Транспорт", "Нерухомість", "Техніка", "Послуги", "Домашні тварини"];

const Home: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { ads, loading } = useSelector((state: RootState) => state.ads);
  const [showForm, setShowForm] = useState(false);

 
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 6;

  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleAdClick = (id: string) => navigate(`/ads/${id}`);


  const filteredAds = ads.filter((ad) => {
    const matchesCategory = selectedCategory ? ad.category === selectedCategory : true;
    const matchesCity = selectedCity ? ad.city === selectedCity : true;
    const matchesMinPrice = minPrice !== "" ? ad.price >= minPrice : true;
    const matchesMaxPrice = maxPrice !== "" ? ad.price <= maxPrice : true;
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesCity && matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  const totalPages = Math.ceil(filteredAds.length / adsPerPage);
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <CircularProgress />
      </div>
    );


  const cities = Array.from(new Set(ads.map((ad) => ad.city)));

  return (
    <div style={{ padding: "16px" }}>
      

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenForm}
        style={{ marginBottom: "16px" }}
      >
        Нове оголошення
      </Button>

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        
        <DialogContent>
          <CreateAdForm onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Пошук"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Категорія"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ minWidth: 150 }}
        >
          <MenuItem value="">Усі</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Місто"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ minWidth: 150 }}
        >
          <MenuItem value="">Усі</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Ціна від"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ width: 100 }}
        />
        <TextField
          label="Ціна до"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ width: 100 }}
        />
      </div>

      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: 0,
          listStyle: "none",
        }}
      >
        {currentAds.map((ad) => (
          <li
            key={ad._id}
            onClick={() => handleAdClick(ad._id)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "300px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            {ad.images.length > 0 && (
              <img
                src={`http://localhost:5000/${ad.images[0].replace(/\\/g, "/")}`}
                alt={ad.title}
                style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "4px" }}
              />
            )}
            <h3 style={{ margin: "0 0 8px 0" }}>{ad.title}</h3>
            <p style={{ margin: "0 0 8px 0" }}>{ad.description}</p>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
              {ad.city || "Місто невідоме"} - ${ad.price || 0}
            </p>
          </li>
        ))}
      </ul>

      
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Попередня
        </Button>
        <Typography style={{ alignSelf: "center" }}>
          {currentPage} / {totalPages}
        </Typography>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Наступна
        </Button>
      </div>
    </div>
  );
};

export default Home;
