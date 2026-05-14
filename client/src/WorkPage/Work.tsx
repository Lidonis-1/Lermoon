import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./work.css";

export default function Work() {
  const { workID } = useParams<{ workID: string }>();
  const [currentBranch, setCurrentBranch] = useState("1"); // По дефолту main
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serverImages, setServerImages] = useState<string[]>([]);

  // Додаємо branch у запит
  const fetchImages = async (branch: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/work?workID=${workID}&branch=${branch}`,
      );
      const data = await response.json();
      setServerImages(data);
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  useEffect(() => {
    fetchImages(currentBranch);
  }, [currentBranch]); // Перезавантажуємо, якщо змінили гілку

  async function uploadFiles() {
    if (!workID || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      // Додаємо branch в URL завантаження
      await fetch(
        `http://localhost:8080/work?workID=${workID}&branch=${currentBranch}`,
        {
          method: "POST",
          body: formData,
        },
      );

      setFiles([]);
      setPreviews([]);
      fetchImages(currentBranch);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  }

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
        `http://localhost:8080/work/delete?workID=${workID}&branch=${currentBranch}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`Помилка: ${response.status}`);
      }

      setServerImages([]);
      setPreviews([]);
      setFiles([]);

      console.log("Гілку очищено");
    } catch (err) {
      console.error(`Помилка видалення: ${err}`);
    }
  }

  return (
    <div className="workscene">
      <div className="workTree">
        {serverImages.map((imgUrl, idx) => (
          <img
            key={`server-${idx}`}
            src={`http://localhost:8080/work/image-stream?workID=${workID}&branch=${currentBranch}&fileName=${imgUrl}`}
            className="imagePreview"
            alt="server-content"
            onClick={() => console.log("в розробці")}
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
        <div className="branch-container">
          {["1", "2", "3"].map((branch) => (
            <button
              key={branch}
              onClick={() => setCurrentBranch(branch)}
              className="saveBut"
            >
              Гілка: {branch}
            </button>
          ))}
        </div>
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
