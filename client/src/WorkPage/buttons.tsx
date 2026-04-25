import { useState } from "react";

export default function upBut() {
  const [state, setState] = useState("ready");
  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (typeof file === "undefined") return;

    setState("sent");
  }
  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    setFile(target.files[0]);

    const file = new FileReader();
    file.onload = function () {
      setPreview(file.result);
    };

    file.readAsDataURL(target.files[0]);
  }
  return (
    <div className="castomButton">
      <input
        type="file"
        name="image"
        onChange={handleOnChange}
        className="imageInput"
      />
    </div>
  );
}
