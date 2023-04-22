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
import { CardType } from "@/modules/cards/types/CardsTypes";
interface ModalProps {
  open: boolean;
  CloseModal: any;
  user: string;
  loadData: () => Promise<void>;
  photo: CardType
  setCurrentPhoto: (val: CardType | null) => Promise<void>
}
const theme = createTheme();
function EditImage({ open, CloseModal, user, loadData, photo, setCurrentPhoto }: ModalProps) {
  const [description, setDescription] = useState<string>(photo.description);
  const [title, setTitle] = useState<string>(photo.title);
  const handleClose = () => CloseModal(false);
  const { sesionRequest } = useSession();
  const [opcion, setOpcion] = useState<string>("editar")
  const [imageLogin, setImageLogin] = useState<File | null>(null);
  const [imageLoginUrl, setImageLoginUrl] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (opcion == "editar") { postData(); }
    setCurrentPhoto(null)
    handleClose();
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
        const respuesta = await sesionRequest({
          tipo: "put",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/photo/${photo.id}`,
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
                  Update Photo
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  variant="filled"
                  value={title}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input type="file" name="file" onChange={handleImageUpload} />
                <Button
                  onClick={() => { setOpcion("editar") }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 1 }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => { setOpcion("cancelar") }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 1 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Container>
        </Modal>
      </ThemeProvider>
    </>
  );
}

export default EditImage;
