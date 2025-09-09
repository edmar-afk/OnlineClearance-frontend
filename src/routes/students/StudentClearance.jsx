import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import Programs from "./Programs";
import api from "../../assets/api";
import { getUserIdFromToken } from "../../utils/auth";
import Fab from "./Fab";
function StudentClearance() {
  const [studentClearance, setStudentClearance] = useState(null);
  const [clearancePrograms, setClearancePrograms] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestClearance, setLatestClearance] = useState(null);
  const [userId, setUserId] = useState(null);
  const [allProgramsStatus, setAllProgramsStatus] = useState({});

  const updateProgramStatus = (name, status) => {
    setAllProgramsStatus((prev) => ({ ...prev, [name]: status }));
  };

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      console.log("No access token found in localStorage.");
      setLoading(false);
      return;
    }

    const id = getUserIdFromToken(access);
    if (!id) {
      console.error("Failed to extract user ID from token.");
      setLoading(false);
      return;
    }

    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    api
      .get(`/api/student/${userId}/`)
      .then((response) => {
        console.log("Student Info:", response.data);
        setStudentData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });

    api
      .get(`/api/student-clearance/${userId}/`)
      .then((res) => {
        const latest = res.data[0];
        setStudentClearance(latest);
        if (latest.status === "Approved") {
          setClearancePrograms(latest.clearance.programs);
        }
      })
      .catch((err) => {
        console.error("Error fetching student clearance", err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Fetch student profile
    api
      .get(`/api/student/${userId}/`)
      .then((response) => {
        //console.log("Student Info:", response.data);
        setStudentData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });

    // Fetch student clearance
    api
      .get(`/api/student-clearance/${userId}/`)
      .then((res) => {
        const latest = res.data[0];
        setStudentClearance(latest);

        if (latest.status === "Approved") {
          setClearancePrograms(latest.clearance.programs);
        }
      })
      .catch((err) => {
        console.error("Error fetching student clearance", err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    api
      .get("/api/clearance/latest/")
      .then((res) => {
        setLatestClearance(res.data);
      })
      .catch((err) => {
        console.error("Error fetching latest clearance:", err);
      });
  }, []);

  const handleRequestClearance = () => {
    const access = localStorage.getItem("access");
    const userId = getUserIdFromToken(access); // ✅ extract user_id from token

    api
      .post("/api/student-clearance/request-latest/", { student_id: userId })
      .then((res) => {
        console.log(res);
        alert("Clearance request submitted successfully!");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error requesting clearance:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  if (loading) return <p>Loading...</p>;

  // console.log("student clearance", studentClearance);
  //console.log("student", studentData);
  return (
    <div className="px-2 md:px-44 py-2 md:py-14">
      <Fab data={studentData} />
      <div className="bg-white h-full shadow-2xl rounded-xl border-2 border-green-200">
        <div className="flex flex-row items-center justify-center pt-8">
          <img src={logo} alt="" className="w-12 md:w-24" />
          <div className="font-bold text-md md:text-2xl flex flex-col items-center ml-2 md:ml-6">
            <p>J.H. CERILLES STATE COLLEGE</p>
            <p>CANUTO M.S. ENERIO CAMPUS</p>
          </div>
        </div>

        <p className="text-center font-semibold italic pt-3 text-md md:text-2xl">
          Biswangan, Lake Wood, Zamboanga del Sur
        </p>

        <div className="text-center pt-8 md:pt-12 text-green-700 font-extrabold text-md md:text-3xl">
          <p className="">CLEARANCE FOR FINAL (EXAMINATION)</p>
          {latestClearance ? (
            <p className="">
              {latestClearance.semester}, {latestClearance.academic_year}
            </p>
          ) : (
            <p className="italic text-gray-500 text-sm">Loading semester...</p>
          )}
        </div>

        <div className="flex flex-col px-2 md:px-44 text-sm md:text-xl pt-12 md:pt-24 space-y-6">
          <div className="flex items-center w-full">
            <span className="whitespace-nowrap mr-2">Name:</span>
            <span className="flex-1 border-b border-black font-bold">
              {studentData?.user.first_name}
            </span>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-6">
            <div className="flex items-center w-full">
              <span className="whitespace-nowrap mr-2">Course & Year:</span>
              <span className="flex-1 border-b border-black font-bold">
                BSIT {studentData?.year_level}
              </span>
            </div>

            <div className="flex items-center w-full">
              <span className="whitespace-nowrap mr-2">Major: </span>
              <span className="flex-1 border-b border-black font-bold">
                {studentData?.major || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-2 md:px-44 py-10 flex flex-col space-y-6">
          {studentClearance?.status === "Approved" ? (
            clearancePrograms.map((program) => (
              <Programs
                key={program.id}
                id={program.id}
                program={program}
                studentId={userId}
                allProgramsStatus={allProgramsStatus}
                updateProgramStatus={updateProgramStatus}
                feedback={allProgramsStatus}
              />
            ))
          ) : studentClearance ? (
            <p className="text-blue-500 text-xl w-96 mx-auto font-bold text-center">
              Your clearance status is "{studentClearance.status}". Programs
              will be shown once confirmed. Please Wait
            </p>
          ) : (
            <div className="text-orange-500 text-center py-24 text-xl font-semibold">
              <p>
                Oops! No clearance record found. Don’t worry — just send a
                request to the school registrar to get started!
              </p>
              <button
                className="text-sm bg-blue-700 text-white py-2 px-4 rounded-md mt-8"
                onClick={handleRequestClearance}
              >
                Send Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentClearance;
