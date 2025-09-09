import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";

function ReasonModal({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(reason); // send reason back to parent
    }
    setReason("");
    handleClose();
  };

  return (
    <div>
      <button onClick={handleOpen}>
        <BlockIcon className="text-red-600 group-hover:text-white transition-colors duration-300" />
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Enter Reason
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Reason"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="error">
                Reject
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ReasonModal;
