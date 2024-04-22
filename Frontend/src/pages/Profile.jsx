import { useState, useEffect } from "react";
import "./Profile.css"; 
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { TbChefHat } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";

function AccountDetails() {
    const url =  import.meta.env.VITE_API_URL;
    const urlFront =  import.meta.env.VITE_FRONT_URL;
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");
    const [userInfo, setUserInfo] = useState({
      email: "usuario@example.com", 
      username: "usuario", // Valor predeterminado
      password: "********", 
    });

    useEffect(() => {
      const cookies = new Cookies();
      const jwt = cookies.get("auth_token");

      axios
        .post(`${url}/get_user/`, {
          jwt: jwt, 
        })
        .then((res) => {
          setUserInfo({
            email: res.data.email,
            username: res.data.username, // Actualizar con el nombre de usuario recibido
            password: "********",
          });
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
        });
    }, []);

    const [deleteChecked, setDeleteChecked] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
  
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

    const handleDeleteAccount = () => {
        if (!deleteChecked || confirmPassword === "") {
          alert(
            "Por favor, confirma la eliminación de la cuenta y proporciona la contraseña."
          );
          return;
        }
        axios
          .post(`${url}/delete_user/`, {
            jwt: jwt, 
            password: confirmPassword,
          })
          .then((res) => {
            if (res.data.type === "SUCCESS") {
              alert(res.data.message);
              cookies.remove("auth_token");
              window.location.href = `${urlFront}/login`;
            } else {
              alert(res.data.message);
            }
          })
          .catch((error) => {
            console.error("Error al eliminar la cuenta:", error);
          });
      };
  
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
                    <label htmlFor="username"><strong>Nombre de usuario</strong></label>
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
                    <label htmlFor="email"><strong>Correo electrónico</strong></label>
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
                    <label htmlFor="password"><strong>Contraseña</strong></label>
                    <div className="input-with-button">
                        <div>{userInfo.password}</div>
                        <Link to="/change_password">
                            <button className="change-button">
                                Cambiar contraseña
                            </button>
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
                    <br>
                    </br>
                    <h5>
                        Soy consciente de que esta acción es irreversible.
                    </h5>
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
