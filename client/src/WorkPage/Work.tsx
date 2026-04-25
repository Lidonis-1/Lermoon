import React from "react";
import { useState } from "react";
import "./work.css";

export default function Work() {
  const [state, setState] = useState("ready");
  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  async function handleAction(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    const selectedFile = target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = function () {
      setPreview(reader.result);
      setState("sent");
    };

    reader.readAsDataURL(selectedFile);
  }

  return (
    <div className="workscene">
      <div className="workTree">
        <div className="castomButton">
          {state === "ready" ? (
            <input
              type="file"
              name="image"
              onChange={handleAction}
              className="imageInput"
            />
          ) : (
            <img src={preview as string} className="imageInput" />
          )}
        </div>
      </div>
      <div className="workintruments"></div>
    </div>
  );
}
