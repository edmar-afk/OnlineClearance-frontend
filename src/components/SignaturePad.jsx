import { useRef, useState, useEffect } from "react";
import SignaturePad from "signature_pad";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import api from "../assets/api";
import { getUserIdFromToken } from "../utils/auth";
const BASE_URL = import.meta.env.VITE_API_URL;

function SignaturePadComponent() {
  const canvasRef = useRef(null);
  const sigPadRef = useRef(null);
  const [imageURL, setImageURL] = useState("");
  const [hasSigned, setHasSigned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [useUpload, setUseUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const fetchSignature = () => {
    const access = localStorage.getItem("access");
    const staffId = getUserIdFromToken(access);
    if (!access || !staffId) return;

    api
      .get(`/api/signature/${staffId}/`)
      .then((res) => {
        if (res.data.image) {
          setImageURL(res.data.image);
          setHasSigned(true);
          setIsEditing(false);
        }
      })
      .catch(() => {
        setHasSigned(false);
        setIsEditing(true);
      });
  };

  useEffect(() => {
    fetchSignature();
  }, []);

  useEffect(() => {
    if (canvasRef.current && !useUpload) {
      sigPadRef.current = new SignaturePad(canvasRef.current, {
        minWidth: 1,
        maxWidth: 3,
        penColor: "black",
      });
    }
  }, [isEditing, useUpload]);

  const clear = () => {
    if (useUpload) {
      setUploadFile(null);
    } else {
      sigPadRef.current?.clear();
    }
    setImageURL("");
  };

  const save = async () => {
    const access = localStorage.getItem("access");
    const staffId = getUserIdFromToken(access);
    if (!access || !staffId) return;

    const formData = new FormData();

    if (useUpload) {
      if (!uploadFile) return;
      formData.append("image", uploadFile);
    } else {
      if (!sigPadRef.current || sigPadRef.current.isEmpty()) return;
      const dataURL = sigPadRef.current.toDataURL("image/png");
      const blob = await (await fetch(dataURL)).blob();
      const file = new File([blob], "signature.png", { type: "image/png" });
      formData.append("image", file);
    }

    formData.append("staff", staffId);

    try {
      await api.post("/api/upload-signature/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access}`,
        },
      });
      setTimeout(() => fetchSignature(), 1000);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSignAgain = () => {
    clear();
    setIsEditing(true);
    setHasSigned(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setHasSigned(true);
    setTimeout(() => {
      fetchSignature();
    }, 500);
  };

  return (
    <div className="p-4 bg-gray-200 mr-6">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[400px] my-14 h-[200px]">
          {hasSigned && !isEditing ? (
            <p className="text-green-700 font-semibold mb-4">
              You have already signed.
            </p>
          ) : (
            <h2 className="mb-3">Sign Below</h2>
          )}

          {hasSigned && !isEditing ? (
            <img
              draggable="false"
              src={`${BASE_URL}${
                imageURL.startsWith("/") ? imageURL : "/" + imageURL
              }?t=${Date.now()}`}
              alt="Uploaded Signature"
              className="rounded-xl border-2 border-gray-400 w-full h-full object-contain"
            />
          ) : useUpload ? (
            <div className="border-2 border-gray-400 bg-white rounded-xl flex items-center justify-center h-full">
              {uploadFile ? (
                <img
                  src={URL.createObjectURL(uploadFile)}
                  alt="Preview"
                  className="rounded-xl w-full h-full object-contain"
                />
              ) : (
                <p className="text-gray-600">
                  Select a signature image to upload
                </p>
              )}
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="rounded-xl border-2 border-gray-400 bg-white"
            />
          )}
        </div>
      </div>

      {hasSigned && !isEditing && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSignAgain}
            className="bg-yellow-600 text-white py-1 px-8 rounded-md hover:bg-yellow-700 transition"
          >
            Sign Again
          </button>
        </div>
      )}

      {isEditing && (
        <div className="mt-2 space-x-2 flex flex-col items-center border-b-1 border-gray-300 pb-8">
          <div className="space-x-4 mb-4">
            <button
              onClick={() => setUseUpload(!useUpload)}
              className="bg-purple-600 text-lg cursor-pointer duration-300 hover:scale-110 text-white py-1 px-8 rounded-md"
            >
              {useUpload ? "Use Draw Pad" : "Use Upload"}
            </button>
          </div>

          {useUpload && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="mb-4 border-2 p-2 border-gray-300"
            />
          )}

          <div className="space-x-4">
            <button
              onClick={clear}
              className="bg-blue-600 text-lg cursor-pointer duration-300 hover:scale-110 text-white py-1 px-8 rounded-md"
            >
              Clear
            </button>
            <button
              onClick={save}
              className="bg-green-600 text-lg cursor-pointer duration-300 hover:scale-110 text-white py-1 px-8 rounded-md"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-lg cursor-pointer duration-300 hover:scale-110 text-white py-1 px-8 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 pt-8 pb-4">
        <p className="text-left font-normal w-[70%]">
          <InfoOutlineIcon
            fontSize="small"
            className="mr-1 text-blue-700 -mt-1 animate-bounce"
          />
          By signing this document with an electronic signature, I agree that
          such signature will be as valid as handwritten signatures to the
          extent allowed by local law.
        </p>
      </div>
    </div>
  );
}

export default SignaturePadComponent;
