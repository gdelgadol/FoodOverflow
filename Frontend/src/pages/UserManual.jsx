import { useState } from 'react';
import './UserManual.css';
function UserManual() {
    const manualContent = [
        {
            id: 1,
            title: "¿Cómo puedo registrarme en Food Overflow?",
            content: [
                { type: "text", value: "Para registrarte en Food Overflow, debes dirigirte a la esquina superior derecha, donde verás un botón de “Registrarse”. Dale clic para ir al formulario de registro de usuario." },
                { type: "text", value: "Una vez en el formulario, ingresas el correo electrónico que deseas registrar, tu nombre de usuario, una descripción opcional sobre tí, eliges un avatar e ingresas la contraseña que quieras utilizar. Una vez los campos obligatorios han sido completados, puedes dar clic en “Registrarse” para que se envíe el correo de activación de tu cuenta. No olvides revisar tu bandeja de entrada y la de spam para ver el correo electrónico." },
                { type: "image", value: "url-de-imagen-registro.png" },
                { type: "text", value: "El correo electrónico que te llega va a tener un botón que dice “Activar Cuenta”. Haz clic en él para activar tu cuenta y terminar el proceso de tu registro." },
                { type: "text", value: "Si ves este mensaje, es porque el registro ha sido exitoso y serás redireccionado a la vista para iniciar sesión. De lo contrario, tendrás que repetir el proceso de registro. ¡Bienvenido a Food Overflow!" }
            ]
        },
        {
            id: 2,
            title: "¿Cómo puedo ingresar a Food Overflow?",
            content: [
                { type: "text", value: "Una vez ya te has registrado como usuario, estás listo para ingresar a tu cuenta. En la esquina superior derecha, a la izquierda del botón de “Registrarse”, vas a ver el botón de “Iniciar sesión”." },
                { type: "image", value: "url-de-imagen-iniciar-sesion.png" },
                { type: "text", value: "Dale clic al botón para ir al formulario de iniciar sesión, donde vas a ingresar el correo electrónico que usaste para registrarte y la contraseña que elegiste. Una vez has ingresado ambos datos en sus campos correspondientes, dale clic a “Iniciar Sesión” para ingresar a tu cuenta." },
                { type: "text", value: "Si los dos datos coinciden, recibirás una alerta de éxito y serás redireccionado al foro para comenzar a usar tu cuenta de Food Overflow. Si no funciona, verifica que estés ingresando todos los datos correctamente." }
            ]
        },
        // Añadir más secciones del manual aquí
    ];

    const [selectedSection, setSelectedSection] = useState(manualContent[0]);

    return (
        <div className="container-um">
            <nav className="menu-um">
                <ul>
                    {manualContent.map(section => (
                        <li key={section.id} onClick={() => setSelectedSection(section)}>
                            {section.title}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="content-um">
                <h2>{selectedSection.title}</h2>
                {selectedSection.content.map((item, index) => {
                    if (item.type === "text") {
                        return <p key={index}>{item.value}</p>;
                    } else if (item.type === "image") {
                        return <img key={index} src={item.value} alt="" className="manual-image-um" />;
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export default UserManual