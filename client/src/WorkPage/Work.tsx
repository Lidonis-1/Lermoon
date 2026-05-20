import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./work.css";

// Окремий інтерфейс для пропсів нашої гілки
interface CreateBranchProps {
  currentBranch: string;
  onAddBranch: () => void;
  lookImg: string;
}

// 1. Назва з великої літери. Компонент приймає номер гілки та колбек для створення нової
function CreateBranch({
  currentBranch,
  onAddBranch,
  lookImg,
}: CreateBranchProps) {
  const { workID } = useParams<{ workID: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serverImages, setServerImages] = useState<string[]>([]);

  async function fetchImages(branch: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/work?workID=${workID}&branch=${branch}`,
      );
      const data = await response.json();
      setServerImages(data);
    } catch (error) {
      console.error("Помилка:", error);
    }
  }

  // Додаємо currentBranch та workID в залежності, щоб хук відпрацьовував коректно при змінах
  useEffect(() => {
    fetchImages(currentBranch);
  }, [currentBranch, workID]);

  async function uploadFiles() {
    if (!workID || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
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

  // Функція підтвердження створення нової гілки при кліку на будь-яке зображення
  const imageClick = () => {
    const confirmCreation = window.confirm(
      `Бажаєте створити нову гілку на основі гілки №${currentBranch}?`,
    );
    if (confirmCreation) {
      onAddBranch();
    }
  };

  return (
    <div className="workBranch">
      <h4>Гілка: {currentBranch}</h4>

      <div className="images-wrapper">
        {serverImages.map((imgUrl, idx) => (
          <img
            key={`server-${idx}`}
            src={`http://localhost:8080/work/image-stream?workID=${workID}&branch=${currentBranch}&fileName=${imgUrl}`}
            className="imagePreview"
            style={{ objectFit: lookImg as any }}
            alt="server-content"
            onClick={imageClick}
          />
        ))}

        {previews.map((src, index) => (
          <img
            key={`preview-${index}`}
            src={src}
            className="imagePreview"
            style={{ objectFit: lookImg as any }}
            alt="preview"
            onClick={imageClick}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div className="castomButton">
          Додати зображення
          <input
            type="file"
            onChange={taker}
            className="imageInput"
            accept="image/*"
          />
        </div>

        {/* Кнопки збереження та видалення тепер тут, бо вони керують станом саме цієї гілки */}
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

export default function Work() {
  const { workID } = useParams<{ workID: string }>();

  const [lookImg, setLookImg] = useState("contain");
  const [branches, setBranches] = useState<string[]>(["1"]);

  async function getAmBranches() {
    try {
      const response = await fetch(
        `http://localhost:8080/work/collector?workID=${workID}`,
      );

      if (!response.ok) {
        throw new Error(`Помилка: ${response.status}`);
      }

      const data = await response.json();
      setBranches((prev) => [...data]);
    } catch (err) {
      console.error(`помилка: ${err}`);
    }
  }

  useEffect(() => {
    getAmBranches();
  }, []);

  // Функція, яка додає +1 до лічильника і створює нову гілку в масиві
  const plBrunch = () => {
    setBranches((prev) => {
      const nextBranchNumber = String(prev.length + 1);
      return [...prev, nextBranchNumber];
    });
  };

  return (
    <div className="workscene">
      {/* Сюди циклом рендеримо всі створені гілки */}
      <div className="workTree">
        {branches.map((branchId) => (
          <CreateBranch
            key={branchId}
            currentBranch={branchId}
            onAddBranch={plBrunch}
            lookImg={lookImg}
          />
        ))}
      </div>

      <div className="workintruments">
        <div className="branch-container">
          {/* Головна кнопка для створення нової гілки вручну з інструментів */}
          <button onClick={plBrunch} className="saveBut">
            + Створити нову гілку ({branches.length + 1})
          </button>
        </div>
        <p>object-fit: {lookImg}</p>
        <div className="choice">
          <button
            className="saveBut"
            style={{ width: "25%" }}
            onClick={() => {
              setLookImg("contain");
            }}
          >
            contain
          </button>
          <button
            className="saveBut"
            style={{ width: "25%" }}
            onClick={() => {
              setLookImg("cover");
            }}
          >
            cover
          </button>
          <button
            className="saveBut"
            style={{ width: "25%" }}
            onClick={() => {
              setLookImg("fill");
            }}
          >
            fill
          </button>
        </div>
      </div>
    </div>
  );
}
