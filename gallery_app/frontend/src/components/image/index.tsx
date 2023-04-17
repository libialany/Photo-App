


import React, { useState } from "react";

import { Backdrop, Fade, Modal } from "@mui/material";



interface ModalProps {
    open: boolean;
    CloseModal: any;
    image: string
}

export default function ImageModal({ open, CloseModal, image }: ModalProps) {
    const handleClose = () => CloseModal(false);
    return (
        <Modal
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                    backgroundcolor: "red"
                }
            }}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            
            <Fade in={open} timeout={500}>
                <img
                    src={image ? `http://localhost:3000${image}` : "https://source.unsplash.com/random"}
                    alt="asd"
                    style={{ maxHeight: "90%", maxWidth: "90%" }}
                />
                
            </Fade>
        </Modal>

    );
}
