import React, { useState, useEffect } from "react";
import "./work.css";
import axios from "axios";

export default function Work() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [serverImages, setServerImages] = useState<string[]>([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/work");
      setServerImages(response.data);
    } catch (error) {
      console.error("списку нема:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  function taker(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadFiles() {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post("http://localhost:8080/work", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFiles([]); // очищити вибрані файли
      setPreviews([]); // очищити прев'ю
      fetchImages(); // оновити список з сервера
      alert("Завантажено успішно!");
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  }

  return (
    <div className="workscene">
      <div className="workTree">
        {serverImages.map((imgUrl, idx) => (
          <img
            key={idx}
            src={`http://localhost:8080/uploads/${imgUrl}`}
            className="imagePreview"
            alt="server-content"
          />
        ))}

        {previews.map((src, index) => (
          <img key={index} src={src} className="imagePreview" alt="preview" />
        ))}

        <div className="castomButton">
          <input type="file" onChange={taker} className="imageInput" />
          <button onClick={uploadFiles} disabled={files.length === 0}></button>
        </div>
      </div>
    </div>
  );
}
