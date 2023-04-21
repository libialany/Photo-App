import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { createTheme } from "@mui/material/styles";
import {
  Button,
  Container,
  Modal,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useSession } from "@/common/hooks/useSession";
interface ModalProps {
  open: boolean;
  CloseModal: any;
  user: string;
  loadData: () => Promise<void>;
}
const theme = createTheme();
function UploadImage({ open, CloseModal, user, loadData }: ModalProps) {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState<string>("");
  const handleClose = () => CloseModal(false);
  const { sesionRequest } = useSession();
  const [imageLogin, setImageLogin] = useState<File | null>(null);
  const [imageLoginUrl, setImageLoginUrl] = useState<string | null>(null);
  const clearInputs = () => {
    setDescription("");
    setTitle("");
    setImageLoginUrl(null);
    setImageLogin(null);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postData();
    handleClose();
    clearInputs();
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setImageLogin(selectedImage);
      // console.log(URL.createObjectURL(selectedImage));
    }
  };
  const postData = async () => {
    try {
      if (imageLogin) {
        const data = new FormData();
        data.append("image", imageLogin);
        data.append("title", title);
        data.append("description", description);
        data.append("id", user);
        // const respuesta = await Servicios.peticion({
        //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/photo`,
        //     tipo: 'post',
        //     body: data
        // })
        const respuesta = await sesionRequest({
          tipo: "post",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/photo`,
          body: data,
        });
        loadData();
        console.log(respuesta);
      }
    } catch (e) {
      console.log(`Error al crear o actualizar count: `, e);
    } finally {
      // setIndicadorCarga(false)
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Modal open={open} onClose={handleClose}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 400,
                bgcolor: "background.paper",
                p: 4,
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <Typography component="h1" variant="h5">
                  Add a Photo
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  variant="filled"
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="descripcion"
                  type="descripcion"
                  id="descripcion"
                  label="Descripcion"
                  variant="filled"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input type="file" name="file" onChange={handleImageUpload} />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Upload
                </Button>
              </Box>
            </Box>
          </Container>
        </Modal>
      </ThemeProvider>
    </>
  );
}

export default UploadImage;
