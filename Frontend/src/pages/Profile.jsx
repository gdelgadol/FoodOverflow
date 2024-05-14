import { useState, useEffect } from "react";
import "./Profile.css";
import axios from "../api/axios.jsx";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { TbChefHat } from "react-icons/tb";
import Swal from "sweetalert2";
import { MdOutlineDelete } from "react-icons/md";

function AccountDetails() {
  const url = import.meta.env.VITE_API_URL;
  const urlFront = import.meta.env.VITE_FRONT_URL;
  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");
  const [userInfo, setUserInfo] = useState({
    email: "usuario@example.com",
    username: "usuario", // Valor predeterminado
    password: "********",
    avatar: "",
    description: "",
  });
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    axios
      .post(`${url}/get_user/profile`, {
        jwt: jwt,
      })
      .then((res) => {
        setUserInfo({
          email: res.data.email,
          username: res.data.username, // Actualizar con el nombre de usuario recibido
          password: "********",
          description: res.data.description,
          avatar: res.data.avatar,
        });
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .post(`${url}/get_avatars`, {})
      .then((res) => {
        setAvatars(res.data.avatars);
        console.log(res.data.avatars);
      })
      .catch((err) => {
        console.error("Error al obtener los avatares:", err);
      });
  }, []);

  const [deleteChecked, setDeleteChecked] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [changingAvatar, setChangingAvatar] = useState(false);
  const [newDescription, setNewDescription] = useState(userInfo.description);

  const handleChangeEmail = () => {
    console.log("Cambiar correo electrónico");
  };

  const handleChangePassword = () => {
    console.log("Cambiar contraseña");
  };

  const handleDeleteChecked = () => {
    setDeleteChecked(!deleteChecked);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEditDescription = () => {
    setEditingDescription(true);
  };

  const handleSaveDescription = () => {
    axios
      .post(`${url}/update_description`, {
        jwt: jwt,
        description: newDescription,
      })
      .then((res) => {
        setAvatars(res.data.avatars);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error al obtener los avatares:", err);
      });
    setChangingAvatar(false);
    setEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setNewDescription(userInfo.description);
    setEditingDescription(false);
  };

  const handleEditAvatar = () => {
    setChangingAvatar(true);
  };

  const handleCancelChangeAvatar = () => {
    setChangingAvatar(false);
  };

  const handleSelectAvatar = () => {
    axios
      .post(`${url}/update_avatar`, {
        jwt: jwt,
        avatar_id: selectedAvatar,
      })
      .then((res) => {
        setAvatars(res.data.avatars);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error al obtener los avatares:", err);
      });
    setChangingAvatar(false);
  };

  const handleDeleteAccount = () => {
    if (!deleteChecked || confirmPassword === "") {
      Swal.fire({
        title:
          "<strong>Por favor, confirma la eliminación de la cuenta y proporciona la contraseña.</strong>",
        icon: "warning",
        timer: 4000,
        confirmButtonColor: "#ff0000",
      });
      return;
    }
    axios
      .post(`${url}/delete_user/`, {
        jwt: jwt,
        password: confirmPassword,
      })
      .then((res) => {
        if (res.data.type === "SUCCESS") {
          cookies.remove("auth_token", { path: "/" });
          Swal.fire({
            title: `<strong>${res.data.message}</strong>`,
            icon: "success",
            confirmButtonColor: "#27ae60",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = `${urlFront}/login`;
            } else if (result.isDenied) {
              window.location.href = `${urlFront}/login`;
            }
          });
        } else {
          Swal.fire({
            title: `<strong>${res.data.message}</strong>`,
            icon: "error",
            timer: 4000,
            confirmButtonColor: "#ff0000",
          });
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la cuenta:", error);
      });
  };

  useEffect(() => {
    setNewDescription(userInfo.description);
  }, [userInfo.description]);

  return (
    <div className="account-details">
      <div className="titulo">
        <center>
          <h2 className="rt-h2">Configuración de la cuenta</h2>
        </center>
      </div>
      <br></br>
      <div className="form2">
        <center>
          <h3 className="rt-h3">Preferencias de la cuenta</h3>
        </center>
        <hr className="separator2" />
        <div className="input-group">
          <label htmlFor="username">
            <strong>Nombre de usuario</strong>
          </label>
          <div className="input-with-button">
            <div>{userInfo.username}</div>
            <Link to="/change_user">
              <button className="change-button" onClick={handleChangeEmail}>
                Cambiar nombre de usuario
              </button>
            </Link>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="username">
            <strong>Descripción</strong>
          </label>
          <div className="input-with-button">
            {editingDescription ? (
              <>
                <div>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{height: "100px", width: "85%"}}
                  />
                </div>
                <button
                  className="change-button"
                  onClick={handleSaveDescription}
                >
                  Confirmar cambio
                </button>
                <button
                  className="cancel-button"
                  onClick={handleCancelEditDescription}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <div style={{ maxWidth: "410px" }}>{userInfo.description}</div>
                <button
                  className="change-button"
                  onClick={handleEditDescription}
                >
                  Cambiar descripción
                </button>
              </>
            )}
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="username">
            <strong>Avatar</strong>
          </label>
          <div className="input-with-button">
            {changingAvatar ? (
              <>
                <div className="pr-avatars">
                  <div className="avatars">
                    {avatars.map((avatar) => (
                      <img
                        key={avatar.avatar_id}
                        src={avatar.avatar_url}
                        alt="Avatar"
                        className={
                          selectedAvatar === avatar.avatar_id ? "selected" : ""
                        }
                        onClick={() => setSelectedAvatar(avatar.avatar_id)}
                      />
                    ))}
                  </div>
                </div>
                <button
                  className="change-button"
                  style={{ marginRight: "5px", marginLeft: "5px" }}
                  onClick={handleSelectAvatar}
                >
                  Confirmar Avatar
                </button>
                <button
                  className="cancel-button"
                  onClick={handleCancelChangeAvatar}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <img
                  style={{ width: "50px", height: "50px", marginTop: "2px" }}
                  src={userInfo.avatar}
                  alt="user-img"
                />
                <button className="change-button" onClick={handleEditAvatar}>
                  Cambiar avatar
                </button>
              </>
            )}
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="email">
            <strong>Correo electrónico</strong>
          </label>
          <div className="input-with-button">
            <div>{userInfo.email}</div>
            <Link to="/change_email">
              <button className="change-button" onClick={handleChangeEmail}>
                Cambiar correo electrónico
              </button>
            </Link>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password">
            <strong>Contraseña</strong>
          </label>
          <div className="input-with-button">
            <div>{userInfo.password}</div>
            <Link to="/change_password">
              <button className="change-button">Cambiar contraseña</button>
            </Link>
          </div>
        </div>
        <div className="delete-account">
          <center>
            <h3 className="rt-h3">Eliminar cuenta</h3>
          </center>
          <hr className="separator2" />
          <div className="input-with-button2">
            <div className="input-with-button2">
              <input
                type="checkbox"
                id="delete"
                checked={deleteChecked}
                onChange={handleDeleteChecked}
              />
              <br></br>
              <h5>Soy consciente de que esta acción es irreversible.</h5>
            </div>
            {deleteChecked && (
              <div className="confirm-password">
                <input
                  type="password"
                  placeholder="Introduce tu contraseña para confirmar"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
            )}
            <button
              className="delete-button"
              onClick={handleDeleteAccount}
              disabled={!deleteChecked || confirmPassword === ""}
            >
              <MdOutlineDelete size={20} /> Borrar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
