/* eslint-disable no-unused-vars */ import { useEffect, useState } from "react";
import api from "../../assets/api";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import ReceiptModal from "./ReceiptModal";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip, IconButton } from "@mui/material";
const BASE_URL = import.meta.env.VITE_API_URL;
const RECEIPT_REQUIRED_ROLES = [
  "Club Treasurer",
  "SSC Treasurer",
  "PTA Treasurer",
];
const CORE_TREASURERS = ["Club Treasurer", "SSC Treasurer", "PTA Treasurer"];
const SECOND_PHASE_APPROVERS = [
  "Computer Lab. In-Charge",
  "Science Lab. In-Charge",
  "School Clinic",
  "Librarian",
  "Guidance Counselor",
  "Accounting",
];
const THIRD_APPROVERS = [
  "Class Adviser",
  "Director of Student Affairs",
  "Program Chair",
  "Registrar",
];

function Programs({
  program,
  studentId,
  allProgramsStatus,
  updateProgramStatus,
  studentClearanceId,
}) {
  const [signatureId, setSignatureId] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [signatureImage, setSignatureImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const isReceiptRequired = RECEIPT_REQUIRED_ROLES.includes(
    program.program_name
  );
  const [feedback, setFeedback] = useState(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const resetReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  useEffect(() => {
    const fetchSignatureStatus = async () => {
      try {
        if (!studentClearanceId || !studentClearanceId.student) return;

        const res = await api.get(
          `/api/clearance-signatures/status/${studentClearanceId.id}/${studentClearanceId.student.id}/${program.id}`
        );

        const progStatus = res.data.status || "No signature yet";
        setStatus(progStatus);
        updateProgramStatus(program.program_name, progStatus);

        // store signatureId for update
        if (res.data.id) {
          setSignatureId(res.data.id);
        }

        if (progStatus === "Approved" && res.data.signature?.image) {
          setSignatureImage(`${BASE_URL}${res.data.signature.image}`);
        }

        if (progStatus === "Rejected") {
          const fbRes = await api.get(
            `/api/feedback/${program.id}/${studentId}/`
          );
          setFeedback(fbRes.data.feedback || null);
        } else {
          setFeedback(null);
        }
      } catch (err) {
        console.error(err);
        setStatus("No signature yet");
        updateProgramStatus(program.program_name, "No signature yet");
        setFeedback(null);
      }
    };

    fetchSignatureStatus();
  }, [studentId, program.id, studentClearanceId]);

  const handleSendRequest = async () => {
    if (isReceiptRequired && !receiptFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Receipt",
        text: "Please select a receipt image before sending the request.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("status", "Pending");
    formData.append("feedback", "Request sent from student");
    if (isReceiptRequired && receiptFile) {
      formData.append("receipt", receiptFile);
    }

    let newStatus = "Pending";

    try {
      let response;
      if (signatureId) {
        response = await api.put(
          `/api/clearance-signatures/update/${signatureId}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await api.post(
          `/api/clearance-signatures/create/${studentId}/${program.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      newStatus = response.data.status;

      const userRes = await api.get(
        `/api/users/by-first-name/${program.program_name}/`
      );
      const userId = userRes.data.id;

      await api.post(`/api/notifications/${userId}/`, {
        title: "Clearance Request",
        message: `A student has requested your approval for ${program.program_name}`,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Request and notification sent successfully!",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "success",
        title: "Notice",
        text: "Request and notification sent successfully!",
        // text: "There was an issue sending the request, but your status has been refreshed.",
      });
    } finally {
      setStatus(newStatus);
      setLoading(false);
    }
  };

  const treasurerStatuses = CORE_TREASURERS.map(
    (name) => allProgramsStatus[name]
  );
  const secondPhaseStatuses = SECOND_PHASE_APPROVERS.map(
    (name) => allProgramsStatus[name]
  );
  const thirdApproverStatuses = THIRD_APPROVERS.map(
    (name) => allProgramsStatus[name]
  );

  const treasurersApproved = treasurerStatuses.every((s) => s === "Approved");
  const secondPhaseApproved = secondPhaseStatuses.every(
    (s) => s === "Approved"
  );

  // Fix here:
  const nonFinalPrograms = Object.keys(allProgramsStatus).filter(
    (name) => !THIRD_APPROVERS.includes(name) && name !== "Campus Director"
  );
  const nonFinalsApproved = nonFinalPrograms.every(
    (name) => allProgramsStatus[name] === "Approved"
  );

  let isDisabled = false;

  if (CORE_TREASURERS.includes(program.program_name)) {
    isDisabled = false;
  } else if (!treasurersApproved) {
    isDisabled = true;
  } else if (!secondPhaseApproved) {
    isDisabled = !SECOND_PHASE_APPROVERS.includes(program.program_name);
  } else if (THIRD_APPROVERS.includes(program.program_name)) {
    isDisabled = !nonFinalsApproved;
  } else if (program.program_name === "Campus Director") {
    const thirdApproverStatuses = THIRD_APPROVERS.map(
      (name) => allProgramsStatus[name]
    );
    const allRequiredApproved =
      treasurersApproved &&
      secondPhaseApproved &&
      thirdApproverStatuses.every((s) => s === "Approved");
    isDisabled = !allRequiredApproved;
  } else {
    isDisabled = false;
  }

  return (
    <div>
      <div
        className={`${
          program.program_name === "Campus Director"
            ? "pt-24 flex flex-col-reverse items-center space-y-reverse space-y-2"
            : "flex flex-row items-center space-x-2"
        }`}
      >
        <div className="w-96 relative">
          {program.program_name === "Campus Director" &&
            status === "Approved" &&
            signatureImage && (
              <img
                src={signatureImage}
                alt="Signature"
                draggable="false"
                className="w-44 h-auto absolute -top-14 left-1/4"
              />
            )}
          <div
            className={`font-bold text-sm md:text-lg ${
              program.program_name === "Campus Director"
                ? " relative flex flex-col items-center mb-14"
                : "text-green-900"
            }`}
          >
            {program.program_name === "Campus Director" ? (
              <>
                <span className="text-green-700 font-extrabold">
                  {program.description}
                </span>
                <span>{program.program_name}</span>
              </>
            ) : (
              `${program.program_name}`
            )}
          </div>
        </div>

        <div
          className={`font-bold text-sm md:text-lg ${
            program.program_name === "Campus Director"
              ? "w-fit "
              : "w-full font-bold text-lg text-green-700 flex flex-col"
          }`}
        >
          <div className="flex flex-row items-center">
            {program.program_name !== "Campus Director" && ":"}

            <div
              className={`flex-1 border-b border-black text-red-400 relative ${
                program.program_name === "Campus Director" ? "" : "pl-1 md:pl-8"
              }`}
            >
              {status === "Approved" &&
              signatureImage &&
              program.program_name !== "Campus Director" ? (
                <img
                  src={signatureImage}
                  alt="Signature"
                  draggable="false"
                  className="w-44 absolute -top-10 left-0"
                />
              ) : (
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span
                    className={`flex flex-row${
                      program.program_name === "Campus Director" ? "hidden" : ""
                    }`}
                  >
                    {status}{" "}
                    {status === "Rejected" && feedback && (
                      <p className="text-red-600 font-semibold ml-1 flex items-center">
                        <Tooltip
                          title={
                            <span className="text-white text-lg">
                              {feedback || "No feedback yet"}
                            </span>
                          }
                          placement="top"
                          open={open}
                          onClose={handleClose}
                          disableHoverListener={false}
                          disableTouchListener
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "red", // red background
                                "& .MuiTooltip-arrow": { color: "red" }, // arrow color matches
                              },
                            },
                          }}
                          arrow
                        >
                          <IconButton
                            size="small"
                            onClick={handleToggle}
                            color="error"
                          >
                            <InfoIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      </p>
                    )}
                  </span>
                  {program.receipt && (
                    <img
                      src={`${BASE_URL}${program.receipt}`}
                      alt="Receipt"
                      className="w-32 h-32"
                    />
                  )}

                  {(status === "No signature yet" ||
                    status === "Pending" ||
                    status === "Rejected") && (
                    <>
                      {isReceiptRequired && (
                        <>
                          {!receiptPreview && (
                            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded cursor-pointer inline-block text-sm">
                              Upload Receipt
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          )}
                          {receiptPreview && (
                            <div className="flex items-center space-x-2">
                              <ReceiptModal
                                program={program.program_name}
                                receiptImg={receiptPreview}
                              />
                              <button
                                onClick={resetReceipt}
                                title="Reset Receipt"
                                className="text-orange-500 hover:text-orange-700"
                              >
                                <RestartAltIcon />
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      <button
                        onClick={handleSendRequest}
                        disabled={loading || isDisabled}
                        className={`text-white px-2 mb-1 rounded-sm text-sm flex items-center space-x-2 ${
                          isDisabled
                            ? "bg-red-600 cursor-not-allowed"
                            : "bg-green-600"
                        } ${loading ? "opacity-70" : ""}`}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={16} color="inherit" />
                            <span className="ml-2">Please wait...</span>
                          </>
                        ) : isDisabled ? (
                          <span>Sign other requirements first</span>
                        ) : (
                          "Send Request"
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Programs;
