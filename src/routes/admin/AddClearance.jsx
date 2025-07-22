import { useState } from "react";import { Modal, Box, Typography, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import api from "../../assets/api";

function AddClearance({ onClearanceAdded }) {
	const [open, setOpen] = useState(false);
	const [academicYear, setAcademicYear] = useState("");
	const [semester, setSemester] = useState("");

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setAcademicYear("");
		setSemester("");
	};

	const handleSubmit = async () => {
		try {
			await api.post("/api/clearances/create/", {
				academic_year: academicYear,
				semester: semester,
			});
			handleClose();
			if (onClearanceAdded) {
				onClearanceAdded(); // 🔁 trigger fresh fetch
			}
		} catch (error) {
			console.error("Failed to create clearance", error);
		}
	};

	const yearOptions = [];
	for (let start = 2024; start <= 2040; start++) {
		yearOptions.push(`${start}-${start + 1}`);
	}

	const semesterOptions = ["First Semester", "Second Semester"];

	return (
		<>
			<Button
				variant="contained"
				onClick={handleOpen}>
				Add Clearance
			</Button>
			<Modal
				open={open}
				onClose={handleClose}>
				<Box
					sx={{
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						mx: "auto",
						mt: "15%",
						borderRadius: 2,
					}}>
					<Typography
						variant="h6"
						mb={2}>
						Add Clearance
					</Typography>

					<FormControl
						fullWidth
						margin="normal">
						<InputLabel>Academic Year</InputLabel>
						<Select
							value={academicYear}
							label="Academic Year"
							onChange={(e) => setAcademicYear(e.target.value)}>
							{yearOptions.map((year) => (
								<MenuItem
									key={year}
									value={year}>
									{year}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						fullWidth
						margin="normal">
						<InputLabel>Semester</InputLabel>
						<Select
							value={semester}
							label="Semester"
							onChange={(e) => setSemester(e.target.value)}>
							{semesterOptions.map((sem) => (
								<MenuItem
									key={sem}
									value={sem}>
									{sem}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box
						mt={2}
						display="flex"
						justifyContent="flex-end">
						<Button
							onClick={handleClose}
							sx={{ mr: 1 }}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							variant="contained"
							disabled={!academicYear || !semester}>
							Submit
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
}

export default AddClearance;
