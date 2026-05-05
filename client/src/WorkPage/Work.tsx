import React, { useState, useEffect } from "react";
import "./work.css";
import axios from "axios";

export default function Work() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serverImages, setServerImages] = useState<string[]>([]);

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:8080/work");
      if (!response.ok) {
        throw new Error(`помилка http: ${response.status}`);
      }
      const data = await response.json();
      setServerImages(data);
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

  async function clearFiles() {
    try {
      const response = await fetch("http://localhost:8080/work/delete", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      setServerImages([]);
      setPreviews([]);
      setFiles([]);
    } catch (err) {
      console.log(`помилка видалення файлу : ${err}`);
    }
  }

  async function uploadFiles() {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await fetch("http://localhost:8080/work", {
        method: "POST",
        body: formData,
      });

      setFiles([]); // очищити вибрані файли
      setPreviews([]); // очищити прев'ю
      fetchImages(); // оновити список з сервера
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  }

  return (
    <div className="workscene">
      <div className="workTree">
        {serverImages.map((imgUrl, idx) => (
          <img
            key={`server-${idx}`}
            src={`http://localhost:8080/uploads/${imgUrl}`}
            className="imagePreview"
            alt="server-content"
            onClick={() => {
              console.log("в розробці");
            }}
          />
        ))}

        {previews.map((src, index) => (
          <img
            key={`preview-${index}`}
            src={src}
            className="imagePreview"
            alt="preview"
            onClick={() => {
              console.log("в розробці");
            }}
          />
        ))}

        <div className="castomButton">
          Додати зображення
          <input
            type="file"
            onChange={taker}
            className="imageInput"
            accept="image/*"
          />
        </div>
      </div>
      <div className="workintruments">
        <button
          onClick={uploadFiles}
          disabled={files.length === 0}
          className="saveBut"
        >
          save progress
        </button>
        <button
          className="saveBut"
          onClick={clearFiles}
          disabled={serverImages.length === 0 && previews.length === 0}
        >
          clear work
        </button>
      </div>
    </div>
  );
}
