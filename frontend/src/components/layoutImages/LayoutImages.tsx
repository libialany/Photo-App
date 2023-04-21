import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useSession } from "@/common/hooks/useSession";
import ImageModal from "../image";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { CardType } from "@/modules/cards/types/CardsTypes";
import { useAuth } from "@/context/auth/AuthProvider";
interface LayoutProps {
  cards: CardType[];
}
function LayoutImages({ cards }: LayoutProps) {
  const { sesionRequest,cerrarSesion } = useSession();
  const { userLogged, reload } = useAuth();
  const [openImagen, setOpenImagen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  return (
    <>
      <ImageModal open={openImagen} CloseModal={setOpenImagen} image={image} />
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {cards &&
            cards.map((card, index) => (
              <Grid item key={`card-${index}-${card.id}`} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: "0.25%",
                      minHeight: 25,
                    }}
                    image={
                      card.url ? card.url : "https://source.unsplash.com/random"
                    }
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>{card.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={async () => {
                        try {
                          await sesionRequest({ url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/load` });
                        } catch (error) {
                          await cerrarSesion();
                        }
                        setImage(card.url);
                        setOpenImagen(true);
                      }}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}

export default LayoutImages;
