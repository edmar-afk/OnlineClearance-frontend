import React, { useEffect, useState } from "react";import DescriptionIcon from "@mui/icons-material/Description";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
import Tooltip from "@mui/material/Tooltip";
import api from "../assets/api";

function Stats() {
	const [programs, setPrograms] = useState([]);
	const [studentCount, setStudentCount] = useState(0);

	useEffect(() => {
		api
			.get("/api/programs/")
			.then((res) => {
				setPrograms(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch programs:", err);
			});

		api
			.get("/api/students/count/")
			.then((res) => {
				setStudentCount(res.data.student_count);
			})
			.catch((err) => {
				console.error("Failed to fetch student count:", err);
			});
	}, []);

	return (
		<div className="w-full flex flex-wrap justify-start mb-24">
			<div className="w-[350px] rounded-lg bg-white p-2 mx-4 my-4 shadow-lg shadow-green-200">
				<div className="flex flex-row items-center pt-2">
					<PeopleIcon
						className="bg-green-400 mr-4 text-white rounded-xl p-3"
						style={{ fontSize: 68 }}
					/>
					<div>
						<p className="mt-2 font-sans text-base font-medium text-gray-500">Total Student</p>
						<div className="flex flex-row justify- items-end">
							<span className="text-3xl font-bold ">{studentCount}</span>
						</div>
					</div>
				</div>
				<div className="my-2"></div>
			</div>

			{/* {programs.map((program) => (
				<div
					key={program.id}
					className="w-[350px] rounded-lg bg-white p-2 mx-4 my-4 shadow-lg shadow-green-200">
					<div className="flex flex-row items-center pt-2">
						<DescriptionIcon
							className="bg-green-400 mr-4 text-white rounded-xl p-3"
							style={{ fontSize: 68 }}
						/>
						<div>
							<p className="mt-2 font-sans text-base font-medium text-gray-500">{program.program_name}</p>
							<div className="flex flex-row justify- items-end">
								<span className="text-3xl font-bold ">15</span>
								<Tooltip
									title={`Total of students`}
									placement="top">
									<span className="text-sm text-red-400 font-bold ml-4 flex flex-row items-center cursor-pointer">
										<PeopleIcon fontSize="small" />
										<p className="ml-1">{studentCount}</p>
									</span>
								</Tooltip>
							</div>
						</div>
					</div>
					<div className="my-2"></div>
				</div>
			))} */}
		</div>
	);
}

export default Stats;
