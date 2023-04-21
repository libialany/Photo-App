import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { Servicios } from "@/common/services/Servicios";

const theme = createTheme();
interface ModalProps {
  open: boolean;
  CloseModal: any;
}

export default function SignUp({ open, CloseModal }: ModalProps) {
  const handleClose = () => CloseModal(false);
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("")
  const { login } = useAuth();
  const clearInputs = () => {
    setPassword("");
    setName("")
    setUserName("");
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveUpdateRequestAccount()
    handleClose();
    clearInputs();
  };
  const saveUpdateRequestAccount = async () => {
    try {
      // setIndicadorCarga(true)
      // await delay(1000)
      const respuesta = await Servicios.peticion({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup`,
        tipo: 'post',
        body: {
          name,
          username,
          password,
          estado: "ACTIVO"
        },
      })
      console.log(respuesta)
    } catch (e) {
      console.log(`Error al crear o actualizar count: `, e)
    } finally {
      // setIndicadorCarga(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={handleClose}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                name="username"
                label="Username"
                variant="filled"
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                id="name"
                required
                fullWidth
                name="name"
                label="Name"
                onChange={(e) => setName(e.target.value)}
                variant="filled"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                variant="filled"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"You have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Modal>
    </ThemeProvider>
  );
}
