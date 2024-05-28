import { useState } from "react";
import "./UserManual.css";
function UserManual() {
  const manualContent = [
    {
      id: 1,
      title: "¿Cómo puedo registrarme en Food Overflow?",
      content: [
        {
          type: "text",
          value:
            "Para registrarte en Food Overflow, debes dirigirte a la esquina superior derecha, donde verás un botón de “Registrarse”. Dale clic para ir al formulario de registro de usuario.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-registro.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez en el formulario, ingresas el correo electrónico que deseas registrar, tu nombre de usuario, una descripción opcional sobre tí, eliges un avatar e ingresas la contraseña que quieras utilizar. Una vez los campos obligatorios han sido completados, puedes dar clic en “Registrarse” para que se envíe el correo de activación de tu cuenta. No olvides revisar tu bandeja de entrada y la de spam para ver el correo electrónico.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-registro2.png?raw=true",
        },
        {
          type: "text",
          value:
            "El correo electrónico que te llega va a tener un botón que dice “Activar Cuenta”. Haz clic en él para activar tu cuenta y terminar el proceso de tu registro.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-activacion.png?raw=true",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-activacion2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Si ves este mensaje, es porque el registro ha sido exitoso y serás redireccionado a la vista para iniciar sesión. De lo contrario, tendrás que repetir el proceso de registro. ¡Bienvenido a Food Overflow!",
        },
      ],
    },
    {
      id: 2,
      title: "¿Cómo puedo ingresar a Food Overflow?",
      content: [
        {
          type: "text",
          value:
            "Una vez ya te has registrado como usuario, estás listo para ingresar a tu cuenta. En la esquina superior derecha, a la izquierda del botón de “Registrarse”, vas a ver el botón de “Iniciar sesión”. ",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-login.png?raw=true",
        },
        {
          type: "text",
          value:
            "Dale clic al botón para ir al formulario de iniciar sesión, donde vas a ingresar el correo electrónico que usaste para registrarte y la contraseña que elegiste. Una vez has ingresado ambos datos en sus campos correspondientes, dale clic a “Iniciar Sesión” para ingresar a tu cuenta.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-login2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Si los dos datos coinciden, recibirás una alerta de éxito y serás redireccionado al foro para comenzar a usar tu cuenta de Food Overflow. Si no funciona, verifica que estés ingresando todos los datos correctamente.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-login3.png?raw=true",
        },
      ],
    },
    {
      id: 3,
      title: "¿Qué hago si olvido mi contraseña?",
      content: [
        {
          type: "text",
          value:
            "En caso de que hayas olvidado la contraseña de tu cuenta, debes ir a la pestaña de inicio de sesión y dar clic en “¿Has olvidado tu contraseña?”.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-olvidecontra.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez le das clic, serás redireccionado a una pestaña donde vas a ingresar el correo que usaste para registrar tu cuenta y un correo será enviado para restablecer tu contraseña.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-olvidecontra2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Luego, revisa la bandeja de entrada o la de spam de tu correo y busca el correo para restablecer tu contraseña.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-olvidecontra3.png?raw=true",
        },
        {
          type: "text",
          value:
            "En el correo verás un botón que dice “Restablecer contraseña”. Haz clic ahí para ir a la pestaña de recuperación e ingresar tu nueva contraseña.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-olvidecontra4.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez en la pestaña, ingresa en los campos tu nueva contraseña y confirma que esa es la que quieres. Luego, haz clic en “Cambiar contraseña” y verás una alerta si el proceso fue exitoso. De lo contrario, intenta hacerlo de nuevo.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-olvidecontra5.png?raw=true",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-olvidecontra6.png?raw=true",
        },
      ],
    },
    {
      id: 4,
      title: "¿Cómo puedo navegar en el foro?",
      content: [
        {
          type: "text",
          value:
            "En el foro puedes seleccionar entre ver recetas o ver publicaciones. Esto se hace dando clic en el menú donde dice “Recetas” y tendrás la opción de elegir entre los dos. También puedes ordenar las publicaciones o recetas en orden de fecha de creación, de votos o de interacción.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-navegar-etiquetas.png?raw=true",
        },
        {
          type: "text",
          value:
            "Adicionalmente, puedes utilizar la barra de navegación para usar las etiquetas y encontrar las publicaciones o recetas que sean de tu interés.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-buscar.png?raw=true",
        },
      ],
    },
    {
      id: 5,
      title: "¿Cómo puedo ver los detalles de una publicación o una receta?",
      content: [
        {
          type: "text",
          value:
            "Para ver los detalles de una publicación o receta, es tan sencillo como dar clic en la misma. Posiciona el cursor sobre la publicación o receta que te interese y para ver si estás seleccionando una publicación o receta, esta se levantará como una carta.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-detalles.png?raw=true",
        },
        {
          type: "text",
          value:
            "Esto te llevará a una pestaña donde verás el autor, título, descripción, ingredientes (si aplica), los votos y los comentarios.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-detalles2.png?raw=true",
        },
      ],
    },
    {
      id: 6,
      title: "¿Cómo puedo valorar una publicación?",
      content: [
        {
          type: "text",
          value:
            "En Food Overflow, la comunidad puede valorar una comunidad mediante los votos. Cada vez que un usuario vota a favor de una publicación, se registra y le suma 1 al contador de votos.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-valorar.png?raw=true",
        },
        {
          type: "text",
          value:
            "Si vota en contra, le resta 1. Para votar a favor o en contra, solo es dar clic en el sombrero de chef o en el sombrero cruzado, respectivamente.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-valorar2.png?raw=true",
        },
      ],
    },
    {
      id: 7,
      title: "¿Cómo puedo comentar en una receta o una publicación?",
      content: [
        {
          type: "text",
          value:
            "Para comentar, debes ir al fondo de la receta o publicación y verás un campo para empezar a escribir el comentario que quieras. Una vez ya tienes tu comentario escrito, puedes dar clic en “Comentar” para que tu comentario se guarde.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-comentar.png?raw=true",
        },
      ],
    },
    {
      id: 8,
      title:
        "¿Cómo puedo responder a un comentario en una receta o publicación?",
      content: [
        {
          type: "text",
          value:
            "Para responder a un comentario, debes buscar el comentario y verás un botón que dice “Responder”. Haz clic ahí y tendrás espacio para responder.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-responder.png?raw=true",
        },
      ],
    },
    {
      id: 9,
      title: "¿Cómo puedo guardar una receta o publicación?",
      content: [
        {
          type: "text",
          value:
            "Si quieres guardar una publicación o receta para poder verla más tarde, debes dar clic en el botón de guardado que está directamente debajo de los votos. Al dar clic, este tendrá un color naranja para confirmar que sí se guardó. Si no lo quieres guardar, solo debes volver a dar clic para quitarla.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-guardar.png?raw=true",
        },
        {
          type: "text",
          value:
            "Puedes ver las publicaciones que has guardado en la pestaña de tu perfil.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-guardar2.png?raw=true",
        },
      ],
    },
    {
      id: 10,
      title: "¿Cómo puedo reportar una publicación, receta o comentario?",
      content: [
        {
          type: "text",
          value:
            "Cuando una publicación, receta o comentario no sigue las reglas establecidas en los términos y condiciones o si sientes que no es apropiada para estar en Food Overflow, puedes reportarla para que un administrador la revise y elimine de ser necesario. Para reportar, debes encontrar el botón que dice “Reportar” y hacer clic en él.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-reportar.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez que le das clic, saldrá un menú para seleccionar la razón por la cual tu consideras que lo que estás reportando no es apropiado.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-reportar2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Cuando ya seleccionas la razón, puedes dar clic en el botón rojo que dice “reportar” para que un administrador revise el contenido.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-reportar3.png?raw=true",
        },
      ],
    },
    {
      id: 11,
      title: "¿Cómo puedo crear una publicación o receta?",
      content: [
        {
          type: "text",
          value:
            "Para poder crear una publicación, tienes que estar registrado e iniciar sesión antes de proceder. Una vez has iniciado sesión, puedes dirigirte a la esquina superior derecha y dar clic en el botón de “Publicar”.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-crear.png?raw=true",
        },
        {
          type: "text",
          value:
            "En la pestaña, podrás elegir entre crear una receta o hacer una publicación.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-crear2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Si eliges la opción de receta, debes llenar los campos del título de la receta, las etiquetas para que describan el contenido de tu receta, los ingredientes que se usan en la receta y una descripción de la receta. Puedes usar el editor de texto para experimentar con la tipografía y también hasta puedes subir imágenes.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-crear3.png?raw=true",
        },
        {
          type: "text",
          value:
            "Si decides hacer una publicación, solo debes escribir el título de tu publicación, las etiquetas que la describen y el contenido, similar a las recetas.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-crear4.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez estés satisfecho con tu publicación o receta, le das clic a “Publicar” y verás tu publicación o receta en el foro de Food Overflow.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-crear5.png?raw=true",
        },
      ],
    },
    {
      id: 12,
      title: "¿Cómo puedo ver detalles de mi perfil?",
      content: [
        {
          type: "text",
          value:
            "Para ver los detalles de tu perfil, es tan sencillo como dar clic en la esquina superior derecha, donde está tu avatar, y luego ir a “Ver mi perfil”.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-perfil.png?raw=true",
        },
        {
          type: "text",
          value:
            "Después de dar clic, serás redireccionado a la pestaña para ver todos los detalles de tu cuenta. Allí, podrás ver tu usuario, tu descripción, avatar, estadísticas, posts guardados y publicaciones y recetas que has hecho.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-perfil2.png?raw=true",
        },
      ],
    },
    {
      id: 13,
      title: "¿Cómo puedo modificar los detalles de mi perfil?",
      content: [
        {
          type: "text",
          value:
            "Si quieres cambiar tu nombre de usuario, correo electrónico, descripción, avatar o contraseña, debes ir a la esquina superior derecha, dar clic en tu avatar y dar clic en “Configuración de cuenta”.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-modificarPerfil.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez ahí, tendrás la opción de hacer los cambios que necesites y te guiará en el proceso de cada uno.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-modificarPerfil2.png?raw=true",
        },
      ],
    },
    {
      id: 14,
      title: "¿Cómo puedo ver otros perfiles?",
      content: [
        {
          type: "text",
          value:
            "Puedes ver otros perfiles dando clic en el nombre que aparece en su respectiva publicación, receta o comentario. También puedes buscar directamente usando la barra de navegación, seleccionando la opción de perfiles e ingresando el nombre de usuario que quieras buscar.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-otrosPerfiles.png?raw=true",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-otrosPerfiles2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Al dar clic en el usuario, serás redireccionado a la pestaña donde están los detalles del usuario y las recetas y publicaciones que ha hecho.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-otrosPerfiles3.png?raw=true",
        },
      ],
    },
    {
      id: 15,
      title: "¿Cómo puedo donar a Food Overflow?",
      content: [
        {
          type: "text",
          value:
            "Si quieres apoyar la misión y visión de Food Overflow, ¡puedes hacer una donación! Primero, debes ir a la pestaña de apóyanos, en la esquina superior derecha.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-donar.png?raw=true",
        },
        {
          type: "text",
          value:
            "Una vez estás ahí, podrás hacer una donación de valor mayor o igual a $5.000 COP. Cuando ingreses el valor que quieres donar, puedes dar clic en “Donar a Food Overflow” y serás redireccionado a MercadoPago para hacer la donación.",
        },
        {
          type: "image",
          value:
            "https://github.com/JOvalleG/FoodOverflow/blob/foro/Frontend/src/assets/userManual/um-donar2.png?raw=true",
        },
        {
          type: "text",
          value:
            "Cuando termines de donar, tendrás un certificado de donación para que tengas una forma de mostrar tu apoyo por esta increíble comunidad.",
        },
      ],
    },
  ];

  const [selectedSection, setSelectedSection] = useState(manualContent[0]);

  return (
    <div>
      <div className="title-um">
        <span>Manual de usuario</span>
      </div>
      <div className="container-um">
        <nav className="menu-um">
          <ul>
            {manualContent.map((section) => (
              <li
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className={section.id === selectedSection.id ? "selected" : ""}
              >
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
              return (
                <div key={index} className="image-container">
                  <img src={item.value} alt="" className="manual-image-um" />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default UserManual;
