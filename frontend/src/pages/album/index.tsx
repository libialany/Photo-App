import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignIn from "@/components/sign-in/SignIn";
import { useAuth } from "@/context/auth/AuthProvider";
import LayoutImages from "@/components/layoutImages/LayoutImages";
import { CardType } from "@/modules/cards/types/CardsTypes";
import { Servicios } from "@/common/services/Servicios";
import { useSession } from "@/common/hooks/useSession";
import SignUp from "@/components/sign-up/SignUp";
import Banner from "@/components/banner/Banner";

const theme = createTheme();

export default function Album() {
  const [open, setOpen] = useState<boolean>(false);
  const [openSignUp, setOpenSignUp] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/photo`
  );
  const { userLogged } = useAuth();
  const { sesionRequest, cerrarSesion } = useSession();
  const [cards, setCards] = useState<CardType[]>([]);
  const loadData = async () => {
    try {
      if (!userLogged) {
        setUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/photo`);
        const response = await Servicios.get({
          url: url,
          headers: {},
        });
        setCards(response);
      } else {
        setUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/photo/${userLogged.id}`);
        const respuesta = await sesionRequest({
          url: url,
        });
        setCards(respuesta);
      }
    } catch (e) {
      console.log(`Error al iniciar sesión: `, e);
    }
  };
  const onLogOut = async () => {
    cerrarSesion();
    loadData();
  };
  useEffect(() => {
    loadData();
  }, [userLogged, open, url]);
  return (
    <>
      <SignIn open={open} CloseModal={setOpen} />
      <SignUp open={openSignUp} CloseModal={setOpenSignUp} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar sx={{ alignItems: "center", paddingLeft: 1 }}>
            <CameraIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Y Album App
            </Typography>
            {userLogged && (
              <Button
                size="small"
                variant="text"
                sx={{ color: "white", p: 2 }}
                onClick={onLogOut}
              >
                Log Out
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Album App
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                This is your own gallery
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {userLogged ? (
                  <>
                    <Banner userLogged={userLogged} loadData={loadData} />
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpenSignUp(true);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Stack>
            </Container>
          </Box>
          <LayoutImages cards={cards} loadData={loadData}/>
        </main>
        {/* Footer */}
        <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
        </Box>
        {/* End footer */}
      </ThemeProvider>
    </>
  );
}
