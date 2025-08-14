import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAd } from "../../store/adsSlice";
import styles from "./CreateAdForm.module.css";

interface CreateAdFormProps {
  onClose: () => void;
}

const allCategories = ["Авто", "Техніка", "Одяг", "Нерухомість", "Послуги", "Для дому"];

const CreateAdForm: React.FC<CreateAdFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState(allCategories[0]);
  const [images, setImages] = useState<File[]>([]);

  const dispatch = useDispatch<any>();

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...images, ...filesArray].slice(0, 5);
      setImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("city", city);
    formData.append("category", category);
    images.forEach((img) => formData.append("images", img));

    dispatch(createAd(formData));
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Створити оголошення</h2>

        <input
          type="text"
          placeholder="Назва"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <input
          type="number"
          placeholder="Ціна"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label>Категорія:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" multiple onChange={handleImagesChange} />

        {images.length > 0 && (
          <div className={styles.imagesPreview}>
            {images.map((img, idx) => (
              <div key={idx} className={styles.imageWrapper}>
                <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
                <button type="button" onClick={() => removeImage(idx)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && <p>Вибрано {images.length} фото</p>}

        <div className={styles.buttons}>
          <button type="button" onClick={onClose}>
            Відмінити
          </button>
          <button type="submit">Створити</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdForm;
