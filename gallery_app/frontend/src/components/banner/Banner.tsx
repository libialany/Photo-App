import { Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserType } from "@/modules/user/types/UserType";
import UploadImage from "../Form/UploadImage";

interface BannerProps {
  userLogged: UserType | null;
  loadData: () => Promise<void>;
}
function Banner({ userLogged, loadData }: BannerProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {userLogged && userLogged.id && (
        <UploadImage open={open} CloseModal={setOpen} user={userLogged.id} loadData={loadData} />
      )}
      <Stack spacing={2} direction="column">
        <Typography variant="h6" align="center" gutterBottom>
          {userLogged && `Hello dear ${userLogged.username}`}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          UPLOAD AN IMAGE
        </Button>
      </Stack>
    </>
  );
}

export default Banner;
