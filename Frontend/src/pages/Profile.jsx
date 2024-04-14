import { useState } from "react";
import "./Profile.css"; 
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";

function AccountDetails() {
    const [userInfo, setUserInfo] = useState({
      email: "usuario@example.com", 
      password: "********", 
    });
    
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    axios
      .post("http://127.0.0.1:8000/get_user/", {
        jwt: jwt, 
      })
      .then((res) => {
        //cookies.remove("auth_token");
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error al eliminar la cuenta:", error);
      });
  
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
          .post("http://127.0.0.1:8000/delete_user/", {
            jwt: jwt, 
            password: confirmPassword,
          })
          .then((res) => {
            if (res.data.type === "SUCCESS") {
              alert(res.data.message);
              cookies.remove("auth_token");
              window.location.href = "http://localhost:5173/login";
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
          <div className="form">
            <h1 className="rt-h1">Detalles de la cuenta</h1>
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <div>{userInfo.email}</div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div>{userInfo.password}</div>
            </div>
            <button className="change-button" onClick={handleChangeEmail}>
              Cambiar correo
            </button>
            <Link to={"/restablecer_contrasena"}>
                <button className="change-button">
                Cambiar contraseña
                </button>
            </Link>
            <div className="delete-account">
            <center>
            <label htmlFor="delete">Eliminar cuenta</label>
            </center>
            <input
                type="checkbox"
                id="delete"
                checked={deleteChecked}
                onChange={handleDeleteChecked}
              />
              <span className="delete-message">
                Soy consciente de que esta acción es irreversible
              </span>

              
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
                Borrar cuenta
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    export default AccountDetails;