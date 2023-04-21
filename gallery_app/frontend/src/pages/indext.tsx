import { useSession } from "@/common/hooks/useSession";
import { Servicios } from "@/common/services/Servicios";
import { useAuth } from "@/context/auth/AuthProvider";
import { readCookie } from "@/utils/session";
import React from "react";
function Index() {
  const { login, userLogged } = useAuth();
  const { sesionRequest } = useSession();
  const guardarActualizarRolesPeticion = async () => {
    try {
      const token = readCookie("access_token_frontend");
      const response = await Servicios.get({
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
      });
      console.log(`🥺 😭 funciona?  ${response}`);
    } catch (e) {
      console.log(`Error al crear o actualizar rol`, e);
    }
  };
  return (
    <div>
      {userLogged && <p>{userLogged.username}</p>}
      <button
        onClick={() => {
          userLogged && console.log(userLogged.username);
        }}
      >
        User
      </button>
      <br></br>
      <button
        onClick={() => {
          login({ username: "3", password: "3" });
        }}
      >
        click me
      </button>
      <br></br>
      <button
        onClick={() => {
          guardarActualizarRolesPeticion();
        }}
      >
        click me for refresh
      </button>
    </div>
  );
}

export default Index;
