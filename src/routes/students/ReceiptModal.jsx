import { useState } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	borderRadius: 2,
	p: 2,
};

function ReceiptModal({ receiptImg, program }) {
	const [open, setOpen] = useState(false);

	return (
		<div>
			<button
				onClick={() => setOpen(true)}
				className="bg-blue-500 text-white px-4 py-1 rounded text-xs">
				View Image
			</button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}>
				<Box sx={style}>
					<div className="flex justify-between items-center mb-4">
						<Typography
							variant="h6"
							component="h2">
							You are about to send this receipt to <b>{program}</b>
						</Typography>
						<IconButton onClick={() => setOpen(false)}>
							<CloseIcon />
						</IconButton>
					</div>
					{receiptImg ? (
						<img
							src={receiptImg}
							alt="Uploaded Receipt"
							className="w-full h-auto rounded"
						/>
					) : (
						<Typography color="text.secondary">No receipt uploaded.</Typography>
					)}
				</Box>
			</Modal>
		</div>
	);
}

export default ReceiptModal;
