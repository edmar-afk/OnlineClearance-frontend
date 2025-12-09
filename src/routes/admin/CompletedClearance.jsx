import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../assets/api";

function CompletedClearance() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const fetchCompleted = async () => {
      const res = await api.get("/api/approved-clearances/");
      setCompleted(res.data);
    };
    fetchCompleted();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="ml-72 pt-8">
        <div className="flex flex-row items-center justify-between mx-8 my-8">
          <p className="font-bold text-3xl">
            Students who Completed the clearance displays here
          </p>
        </div>

        <div className="flex flex-col mx-8">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="relative flex flex-row justify-between text-gray-500 focus-within:text-gray-900 mb-4">
                <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none ">
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
                  placeholder="Search Student"
                />

              </div>

              <div className="overflow-hidden">
                <table className="min-w-full rounded-xl">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        scope="col"
                        className="p-5 text-left text-sm font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="p-5 text-left text-sm font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        Year Level - Course
                      </th>
                      <th
                        scope="col"
                        className="p-5 text-left text-sm font-semibold text-gray-900 capitalize rounded-t-xl"
                      >
                        Major
                      </th>

                      <th
                        scope="col"
                        className="p-5 text-left text-sm font-semibold text-gray-900 capitalize"
                      >
                        Clearance Completed
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-300">
                    {completed.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                      >
                        <td className="p-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.first_name}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.year_level} - {item.last_name}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.major ? item.major : "N/A"}
                        </td>

                        <td className="p-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.academic_year} - {item.semester}
                        </td>
                      </tr>
                    ))}

                    {completed.length === 0 && (
                      <tr>
                        <td
                          colSpan="2"
                          className="p-5 text-center text-sm font-medium text-gray-500"
                        >
                          No completed clearances found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompletedClearance;
