import { useEffect, useRef, useState } from "react";
import Notify from "./Notification";
import { bulkUploadCustomers } from "../../Utils/api";

const UploadModal = ({ getCustomers }) => {
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const filesAccepted = ["xlsx"];
  const inputRef = useRef();
  const modalRef = useRef();

  const handleDialog = () => {
    if (modalRef.current.open) {
      inputRef.current.value = "";
      setFiles([]);
      modalRef.current.close();
    } else {
      if (status && status.loaded === status.total) setStatus(null);
      if (files.filter((f) => !f.discard).length) modalRef.current.showModal();
      else {
        inputRef.current.click();
      }
    }
  };

  const handleChange = (evt) => {
    if (status) return;
    let docs = [];

    if (evt.type === "drop") {
      evt.preventDefault();
      docs.push(...evt.dataTransfer.files);
    } else if (evt.target.files.length) {
      docs.push(...evt.target.files);
    }

    if (docs.length) {
      setFiles(docs);
      modalRef.current.showModal();
    } else modalRef.current.close();
  };

  const uploadFile = async () => {
    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file, file.name);
    }

    modalRef.current.close();

    try {
      const response = await bulkUploadCustomers(formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => setStatus(ev),
      });
      if (response.status === 200) {
        Notify("Files uploaded successfully", "success");

        inputRef.current.value = "";
        setFiles([]);
        getCustomers();
      }
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setStatus(null);
    }
  };

  useEffect(() => {
    if (files.filter((f) => !f.discard).length === 0) modalRef.current.close();
  }, [files]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length || e.target.reportValidity()) {
      uploadFile();
    }
  };

  const isFilesValid = (files) =>
    files.length &&
    files.every(
      (f) =>
        filesAccepted.includes(f.name.slice(f.name.lastIndexOf(".") + 1)) &&
        f.size <= 5 * 1024 * 1024,
    );

  return (
    <>
      <div
        id="dropzone"
        className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dotted border-gray-400 bg-gray-100 p-4 py-6 transition-all ease-in hover:bg-gray-200"
        onClick={handleDialog}
        onDrop={handleChange}
        onDragOver={(e) => e.preventDefault()}
        draggable={true}
      >
        {status ? (
          <>
            <span className="material-symbols-rounded animate-spin">
              progress_activity
            </span>
            <span className="text-center text-sm font-bold text-gray-600">
              {status.loaded === status.total
                ? "Processing..."
                : `Uploading... ${Math.round(
                    (status.loaded / status.total) * 100,
                  )}%`}
            </span>
          </>
        ) : (
          <>
            <span className="material-symbols-rounded text-3xl text-gray-600">
              cloud_upload
            </span>
            <span className="text-center text-sm text-gray-600">
              Click to browse or drop here to upload.
              <br />
              Supported Formats: {filesAccepted.map((f) => `.${f}`).join(", ")}.
              Maximum Individual File size: 5 MB
            </span>
          </>
        )}
      </div>
      <dialog
        ref={modalRef}
        className="z-10 hidden w-full max-w-[480px] flex-col items-center rounded-lg bg-white p-8 shadow outline-0 backdrop:backdrop-blur-[1px] open:flex"
      >
        <span className="mb-4 text-lg font-bold">Upload File</span>
        <span className="w-full text-sm">
          Select the document type, then upload the document.
        </span>

        <form onSubmit={handleSubmit} className="mt-4 w-full">
          <input
            ref={inputRef}
            required={!files.length}
            onChange={handleChange}
            type="file"
            multiple={true}
            hidden={true}
            name="analysis-docs"
            accept={filesAccepted.map((f) => `.${f}`).join(", ")}
          />
          <ul className="light-scroll mt-4 flex max-h-40 min-h-80 w-full flex-col gap-1 overflow-y-auto">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex w-full items-center justify-between gap-4 text-nowrap rounded-md bg-gray-100 px-4 py-3"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="overflow-hidden overflow-ellipsis text-sm font-medium">
                    {file.name}
                  </span>
                  {!isFilesValid([file]) && (
                    <span className="mt-1 overflow-hidden overflow-ellipsis text-xs font-medium text-red-600">
                      {file.size > 5 * 1024 * 1024
                        ? "File size exceeds 5MB."
                        : filesAccepted.includes(
                              file.name.slice(file.name.lastIndexOf(".") + 1),
                            )
                          ? "Invalid file format."
                          : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="material-symbols-rounded text-xl"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                  >
                    close
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex w-full flex-col items-center gap-1">
            <button
              type="submit"
              disabled={!isFilesValid(files)}
              className="bg-accentBack w-full rounded-md p-3 text-sm font-medium text-white disabled:bg-gray-200 disabled:text-black"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => modalRef.current.close()}
              className="w-full rounded-md p-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default UploadModal;
