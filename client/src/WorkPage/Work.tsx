import React, { useState } from "react";
import "./work.css";

import axios from "axios";

export default function Work() {
  /
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  async function handleAction(e: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <div className="workscene">
      <div className="workTree">
        {previews.map((src, index) => (
          <img key={index} src={src} className="imagePreview" />
        ))}
        <div className="castomButton">
          <input
            type="file"
            name="image"
            onChange={handleAction}
            className="imageInput"
          />
        </div>
      </div>
      <div className="workintruments"></div>
    </div>
  );
}
