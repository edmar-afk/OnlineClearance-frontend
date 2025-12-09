import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import api from "../../assets/api";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
function ClearanceRequestTable() {
	const [students, setStudents] = useState([]);
	console.log("Students:", students);
	useEffect(() => {
		api
			.get("/api/student-clearances/")
			.then(async (res) => {
				const clearances = res.data;

				const updatedClearances = await Promise.all(
					clearances.map(async (item) => {
						const studentDetail = await fetchStudentDetail(item.student.id);
						return { ...item, studentDetail };
					})
				);

				setStudents(updatedClearances);
			})
			.catch((err) => {
				console.error("Failed to fetch student clearances:", err);
			});
	}, []);

	const handleStatusUpdate = (id, newStatus) => {
		api
			.patch(`/api/student-clearances/${id}/update-status/`, { status: newStatus })
			.then((res) => {
				console.log(res);
				setStudents((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
			})
			.catch((err) => {
				console.error("Failed to update status:", err);
			});
	};

	const fetchStudentDetail = async (userId) => {
		try {
			const response = await api.get(`/api/student/${userId}/`);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch student detail:", error);
			return null;
		}
	};

	return (
		<div className="flex flex-col">
			<div className=" overflow-x-auto">
				<div className="min-w-full inline-block align-middle">
					<div className="relative flex flex-row justify-between text-gray-500 focus-within:text-gray-900 mb-4">
						<div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none ">
							<svg
								className="w-5 h-5"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
									stroke="#9CA3AF"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
								<path
									d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
									stroke="black"
									strokeOpacity="0.2"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
								<path
									d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
									stroke="black"
									strokeOpacity="0.2"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<input
							type="text"
							id="default-search"
							className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
							placeholder="Search Academic Year"
						/>
					</div>
					<div className="overflow-hidden ">
						<table className=" min-w-full rounded-xl">
							<thead>
								<tr className="bg-gray-50">
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
										{" "}
										Student Name
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
										{" "}
										Year Level
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
										{" "}
										Course
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize">
										{" "}
										Status{" "}
									</th>

									{/* <th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl">
										{" "}
										Actions{" "}
									</th> */}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-300 ">
								{students.map((clearance) => (
									<tr
										key={clearance.id}
										className="bg-white transition-all duration-500 hover:bg-gray-50">
										<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
											{" "}
											{clearance.studentDetail?.user?.first_name}
										</td>
										<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
											{" "}
											{clearance.studentDetail?.year_level}
										</td>
										<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
											{clearance.studentDetail?.user?.last_name}{" "}
										</td>
										<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{" "}
											{clearance.status}
										</td>
										{/* <td className=" p-5 ">
											<div className="flex items-center gap-1">
												<button
													onClick={() => handleStatusUpdate(clearance.id, "Approved")}
													data-tooltip-id="approve-tooltip"
													data-tooltip-content="Approve"
													className="p-2 rounded-full group transition-all duration-500 hover:scale-110 cursor-pointer flex items-center hover:bg-blue-600">
													<DoneAllIcon className="text-green-600 group-hover:text-white transition-colors duration-300" />
													<Tooltip id="approve-tooltip" />
												</button>

												<button
													onClick={() => handleStatusUpdate(clearance.id, "Pending")}
													data-tooltip-id="pending-tooltip"
													data-tooltip-content="Set to Pending"
													className="p-2 rounded-full group transition-all duration-500 hover:scale-110 cursor-pointer flex items-center hover:bg-orange-600">
													<HourglassEmptyIcon className="text-orange-600 group-hover:text-white transition-colors duration-300" />
													<Tooltip id="pending-tooltip" />
												</button>

												<button
													onClick={() => handleStatusUpdate(clearance.id, "Rejected")}
													data-tooltip-id="reject-tooltip"
													data-tooltip-content="Reject"
													className="p-2 rounded-full group transition-all duration-500 hover:scale-110 cursor-pointer flex items-center hover:bg-red-600">
													<BlockIcon className="text-red-600 group-hover:text-white transition-colors duration-300" />
													<Tooltip id="reject-tooltip" />
												</button>
											</div>
										</td> */}
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

export default ClearanceRequestTable;
