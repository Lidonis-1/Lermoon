import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./work.css";
import axios from "axios";

export default function Work() {
  const { workID } = useParams<{ workID: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serverImages, setServerImages] = useState<string[]>([]);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/work?workID=${workID}`,
      );
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
      const response = await fetch(
        `http://localhost:8080/work/delete?workID=${workID}`,
        {
          method: "DELETE",
        },
      );
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
    // 1. Перевірка: якщо ID немає, нічого не робимо
    if (!workID || files.length === 0) {
      console.error("workID відсутній!");
      return;
    }

    const formData = new FormData();
    // Можна навіть не додавати в body, якщо ми шлемо через URL
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      // 2. Обов'язково encodeURIComponent для безпеки URL
      await fetch(
        `http://localhost:8080/work?workID=${encodeURIComponent(workID)}`,
        {
          method: "POST",
          body: formData,
        },
      );

      setFiles([]);
      setPreviews([]);
      fetchImages();
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
            src={`http://localhost:8080/uploads/${workID}/${imgUrl}`}
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
