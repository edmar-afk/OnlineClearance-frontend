/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */ import {
  useEffect,
  useState,
} from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import api from "../../assets/api";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ViewReceipt from "./ViewReceipt";
import ReasonModal from "./ReasonModal";
const BASE_URL = import.meta.env.VITE_API_URL;

function SignatureRequestsTable({
  staffId,
  staffProgram,
  year,
  course,
  isSuperUser,
  facultyInfo,
}) {
  const [signatures, setSignatures] = useState([]);

  console.log("Signatures:", signatures);

  useEffect(() => {
    const program = isSuperUser ? "none" : staffProgram || "none";
    const last = isSuperUser
      ? "none"
      : course?.includes(" - ")
      ? course.split(" - ")[0]
      : course || "none";
    const yr = isSuperUser
      ? "none"
      : course?.includes(" - ")
      ? course.split(" - ")[1]
      : year || "none";

    const isIronClub = staffProgram === "Iron Club Treasurer";
    const isFuelClub = staffProgram === "Fuel Club Treasurer";

    const endpoint = isIronClub
      ? `/api/clearance/iron-club/`
      : isFuelClub
      ? `/api/clearance/fuel-club/`
      : `/api/clearance-signatures/${program}/${last}/${yr}/`;

    api
      .get(endpoint)
      .then(async (res) => {
        const clearances = res.data;

        const updatedClearances = await Promise.all(
          clearances.map(async (item) => {
            const signatureDetail = await fetchSignatureDetail(item.student.id);
            return { ...item, signatureDetail };
          })
        );

        setSignatures(updatedClearances);
      })
      .catch((err) => {
        console.error("Failed to fetch signature clearances:", err);
      });
  }, []);

  const handleStatusUpdate = (id, newStatus, reason = null) => {
    const payload = { status: newStatus };
    console.log("🧠 Updating ID:", id);

    if (newStatus === "Approved") payload.staffId = staffId;
    if (newStatus === "Rejected" && reason) payload.feedback = reason;

    const url =
      staffProgram === "Iron Club Treasurer"
        ? `/api/clearance/iron-club/${id}/update-status/`
        : staffProgram === "Fuel Club Treasurer"
        ? `/api/clearance/fuel-club/${id}/update-status/`
        : `/api/clearance-signatures/${id}/update-status/`;

    api
      .patch(url, payload)
      .then(async (res) => {
        const updatedSignature = signatures.find((s) => s.id === id);
        const studentId = updatedSignature?.signatureDetail?.user?.id;
        const programName =
          updatedSignature?.programs?.program_name || "Program";

        setSignatures((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: newStatus,
                  feedback: reason || item.feedback,
                }
              : item
          )
        );

        if (newStatus === "Rejected" && studentId) {
          try {
            await api.post(`/api/notifications/${studentId}/`, {
              title: `${programName} Signature Rejected`,
              message: reason,
            });
            console.log("✅ Notification uploaded");
          } catch (error) {
            console.error("❌ Failed to send notification:", error);
          }
        }
      })
      .catch((err) => {
        console.error("❌ Failed to update status:", err);
      });
  };

  const fetchSignatureDetail = async (userId) => {
    try {
      const response = await api.get(`/api/student/${userId}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch signature detail:", error);
      return null;
    }
  };

  console.log(
    "Iron Club signature IDs:",
    signatures.map((s) => s.id)
  );

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="relative flex flex-row justify-between text-gray-500 focus-within:text-gray-900 mb-4">
            <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                  stroke="#9CA3AF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <input
              type="text"
              id="default-search"
              className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
              placeholder="Search"
            />
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full rounded-xl">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                    Name
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                    Year Level
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                    Program
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                    A.Y. - Semester
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                    Reciepts
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
                    Status
                  </th>
                  <th className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {[...signatures].reverse().map((signature) => (
                  <tr
                    key={signature.id}
                    className="bg-white transition-all duration-500 hover:bg-gray-50"
                  >
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {signature.signatureDetail?.user?.first_name}
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {signature.signatureDetail?.year_level} -{" "}
                      {signature.signatureDetail?.user?.last_name}
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {signature.programs.program_name}
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {signature.clearance?.clearance?.academic_year} -{" "}
                      {signature.clearance?.clearance?.semester}
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {signature.receipt ? (
                        <ViewReceipt
                          name={signature.signatureDetail?.user?.first_name}
                          yearLvl={
                            course?.includes(" - ")
                              ? course.split(" - ")[1]
                              : ""
                          }
                          course={signature.signatureDetail?.user?.last_name}
                          program={signature.programs.program_name}
                          imageUrl={`${BASE_URL}${signature.receipt}`}
                        />
                      ) : (
                        <span className="text-gray-500 italic">No receipt</span>
                      )}
                    </td>

                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      {signature.status}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleStatusUpdate(signature.id, "Approved")
                          }
                          data-tooltip-id="approve-tooltip"
                          data-tooltip-content="Approve"
                          className="p-2 rounded-full group transition-all duration-500 hover:scale-110 cursor-pointer flex items-center hover:bg-blue-600"
                        >
                          <DoneAllIcon className="text-green-600 group-hover:text-white transition-colors duration-300" />
                          <Tooltip id="approve-tooltip" />
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(signature.id, "Pending")
                          }
                          data-tooltip-id="pending-tooltip"
                          data-tooltip-content="Set to Pending"
                          className="p-2 rounded-full group transition-all duration-500 hover:scale-110 cursor-pointer flex items-center hover:bg-orange-600"
                        >
                          <HourglassEmptyIcon className="text-orange-600 group-hover:text-white transition-colors duration-300" />
                          <Tooltip id="pending-tooltip" />
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(signature.id, "Rejected")
                          }
                          data-tooltip-id="reject-tooltip"
                          data-tooltip-content="Reject"
                          className="p-2 rounded-full group transition-all duration-500 hover:scale-110 cursor-pointer flex items-center hover:bg-red-600"
                        >
                          <ReasonModal
                            onSubmit={(reason) =>
                              handleStatusUpdate(
                                signature.id,
                                "Rejected",
                                reason
                              )
                            }
                          />

                          <Tooltip id="reject-tooltip" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignatureRequestsTable;
