import Logo_about_us from '../assets/Logo_about_us.png';
import "./Acuerdo.css"; 


function Acuerdo () {

    const emailAddress = "foodoverflow02@gmail.com";

    return(
        <div className='ac-container'>
            <div className='ac-logo-eslogan'>
                <img
                alt="Logo de Food Overflow"
                src={Logo_about_us}
                className='ac-logo'
                />
                <div className='ac-eslogan'>
                    <span className="ac-name-text">Food Overflow</span>
                    <h1 className="ac-eslogan-text">Acuerdo de privacidad</h1>
                </div>
            </div>

            <div className='ac-text'> 
                <p>En Food Overflow, reconocemos la importancia de proteger la privacidad de nuestros usuarios y la confidencialidad de los datos que se ingresan. Este acuerdo de privacidad describe cómo recopilamos, almacenamos, utilizamos y protegemos la información personal que nos proporcionas cuando utilizas nuestra plataforma en línea.</p>
                <br></br>
                <hr className="separator2" /> 
                <p><strong>1. Recopilación de Información</strong></p>
                <p>Recopilamos información personal de diversas formas cuando utilizas nuestra plataforma. Esto puede incluir información que nos proporcionas directamente al registrarte para obtener una cuenta, participar en actividades interactivas en nuestro sitio web, o comunicarte con nosotros a través de correo electrónico u otros medios.</p>
                <p>La información que podemos recopilar incluye, pero no se limita a:</p>
                <ul>
                    <li>Información de contacto, como tu nombre, dirección de correo electrónico y número de teléfono.</li>
                    <li>Información de perfil, como tu edad, género, preferencias gastronómicas y otras preferencias relacionadas con la comida.</li>
                    <li>Información de inicio de sesión, como nombres de usuario y contraseñas.</li>
                    <li>Información sobre tus interacciones con nuestro sitio web, como tus búsquedas, visualizaciones de contenido y actividades en la plataforma.</li>
                </ul>

                <p><strong>2. Uso de la Información</strong></p>
                <p>Utilizamos la información que recopilamos para diversos fines, que incluyen, entre otros:</p>
                <ul>
                    <li>Proporcionar y mejorar nuestros servicios, incluida la personalización del contenido y las recomendaciones para adaptarse a tus intereses.</li>
                    <li>Comunicarnos contigo sobre tu cuenta, actividades en la plataforma y actualizaciones de nuestros servicios.</li>
                    <li>Analizar el uso del sitio y realizar investigaciones para comprender mejor las necesidades y preferencias de nuestros usuarios.</li>
                    <li>Cumplir con nuestras obligaciones legales y proteger nuestros derechos, propiedad y seguridad, así como los de nuestros usuarios y terceros.</li>
                </ul>

                <p><strong>3. Compartir de Información</strong></p>
                <p>No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales, excepto cuando sea necesario para proporcionar nuestros servicios, cumplir con la ley o proteger nuestros derechos.</p>
                <p>Podemos compartir tu información en las siguientes circunstancias:</p>
                <ul>
                    <li>Con proveedores de servicios que realizan servicios en nuestro nombre, como procesamiento de pagos, análisis de datos y servicios de alojamiento web.</li>
                    <li>Cuando creemos de buena fe que es necesario para proteger nuestros derechos, propiedad o seguridad, o para cumplir con la ley, una orden judicial o un proceso legal.</li>
                    <li>En caso de una fusión, adquisición, reestructuración u otra transacción comercial en la que se involucre Food Overflow, en cuyo caso la información del usuario puede ser uno de los activos transferidos.</li>
                </ul>

                <p><strong>4. Cookies y Tecnologías Similares</strong></p>
                <p>Utilizamos cookies y tecnologías similares para recopilar información sobre tus preferencias y actividades en nuestro sitio web. Estas tecnologías nos ayudan a proporcionar una experiencia personalizada y a mejorar la funcionalidad y el rendimiento de nuestro sitio.</p>
                <p>Puedes controlar el uso de cookies a través de la configuración de tu navegador y retirar tu consentimiento en cualquier momento eliminando las cookies de tu dispositivo.</p>

                <p><strong>5. Seguridad de la Información</strong></p>
                <p>Tomamos medidas razonables para proteger la información personal que recopilamos contra accesos no autorizados, divulgación, alteración o destrucción. Sin embargo, ten en cuenta que ninguna medida de seguridad es completamente impenetrable y que no podemos garantizar la seguridad absoluta de tu información.</p>

                <p><strong>6. Cambios en este Acuerdo de Privacidad</strong></p>
                <p>Nos reservamos el derecho de actualizar o modificar este acuerdo de privacidad en cualquier momento. Te notificaremos sobre cambios significativos en la forma en que tratamos tu información personal enviándote una notificación a la dirección de correo electrónico que proporcionaste, o publicando una notificación destacada en nuestro sitio web. El uso continuado de nuestro sitio web después de dichos cambios constituirá tu aceptación de los mismos.</p>

                <p><strong>7. Contacto</strong></p>
                <p>Si tienes preguntas, comentarios o inquietudes sobre este acuerdo de privacidad o nuestras prácticas de privacidad, por favor contáctanos a través de <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</p>
                <p>Fecha de entrada en vigor: 2 de Mayo de 2024</p>
                <p>Última actualización: 2 de Mayo de 2024</p>
            </div>
        </div>
    )
}

export default Acuerdo;
