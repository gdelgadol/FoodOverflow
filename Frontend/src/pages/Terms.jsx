import Logo_about_us from '../assets/Logo_about_us.png';
import "./Terms.css"; 


function Terms () {

    const emailAddress = "foodoverflow02@gmail.com";

    return(
        <div className='terms-container'>
            <div className='terms-logo-eslogan'>
                <img
                alt="Logo de Food Overflow"
                src={Logo_about_us}
                className='terms-logo'
                />
                <div className='terms-eslogan'>
                    <span className="terms-name-text">Food Overflow</span>
                    <h1 className="terms-eslogan-text">Términos y condiciones de uso</h1>
                </div>
            </div>

            <div className='terms-text'> 
                <p>Bienvenido a Food Overflow. Te invitamos a leer atentamente estos términos y condiciones antes de utilizar nuestra plataforma. Al acceder y utilizar nuestro sitio web, aceptas cumplir con estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de estos términos, te pedimos amablemente que no hagas uso de nuestro sitio web.</p>
                <br></br>
                <hr className="separator2" /> 
                <p><strong>1. Aceptación de los Términos</strong></p>
                <p>1.1. Al acceder a nuestro sitio web, aceptas estos términos y condiciones de uso, así como nuestra política de privacidad. Si no estás de acuerdo con estos términos, por favor, no utilices nuestra plataforma.</p>
                <p>1.2. Nos reservamos el derecho de actualizar, modificar o cambiar estos términos y condiciones en cualquier momento sin previo aviso. Es tu responsabilidad revisar periódicamente estos términos para estar al tanto de las modificaciones. El uso continuado de nuestro sitio web después de la publicación de cambios constituye la aceptación de dichos cambios.</p>

                <p><strong>2. Uso de la Plataforma</strong></p>
                <p>2.1. Food Overflow es una plataforma en línea diseñada para conectar a la comunidad gastronómica, permitiéndoles compartir recetas, técnicas culinarias, y disfrutar del amor por la comida de manera colaborativa y respetuosa.</p>
                <p>2.2. Al utilizar nuestra plataforma, te comprometes a no utilizarla de ninguna manera que pueda dañar, deshabilitar, sobrecargar o deteriorar la funcionalidad del sitio web, o interferir en el uso y disfrute de otros usuarios.</p>
                <p>2.3. No podrás utilizar nuestra plataforma para distribuir contenido ilegal, difamatorio, obsceno, amenazante, abusivo, discriminatorio, o que infrinja los derechos de propiedad intelectual de terceros.</p>
                <p>2.4. Nos reservamos el derecho de eliminar cualquier contenido que consideremos inapropiado o que viole estos términos y condiciones, así como de suspender o cerrar cuentas de usuarios que incumplan repetidamente estas normas.</p>
                <p>2.5. Queda terminantemente prohibida la publicación de contenido que promueva la violencia, el odio, el acoso, la discriminación, el contenido sexualmente sugerente o cualquier forma de comportamiento violento o inapropiado.</p>

                <p><strong>3. Registro de Usuarios</strong></p>
                <p>3.1. Para acceder a ciertas funciones y servicios de nuestra plataforma, es posible que necesites registrarte como usuario. Al registrarte, te comprometes a proporcionar información precisa y actualizada sobre ti mismo.</p>
                <p>3.2. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, y de restringir el acceso a tu computadora y dispositivos. Eres completamente responsable de todas las actividades que ocurran bajo tu cuenta.</p>
                <p>3.3. Nos reservamos el derecho de rechazar o cancelar cuentas, así como de eliminar o modificar contenido, a nuestra entera discreción, si consideramos que viola estos términos y condiciones.</p>

                <p><strong>4. Propiedad Intelectual</strong></p>
                <p>4.1. Todos los derechos de propiedad intelectual sobre el contenido de nuestro sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes, videos, y software, son propiedad de Food Overflow o de sus licenciantes.</p>
                <p>4.2. Está prohibido copiar, reproducir, distribuir, transmitir, modificar o crear obras derivadas del contenido de nuestro sitio web sin nuestro consentimiento expreso por escrito.</p>
                <p>4.3. Al publicar contenido en nuestra plataforma, otorgas a Food Overflow una licencia mundial, no exclusiva, transferible, libre de regalías para utilizar, reproducir, distribuir y mostrar dicho contenido en relación con la operación y promoción de nuestra plataforma.</p>

                <p><strong>5. Enlaces a Terceros</strong></p>
                <p>5.1. Nuestro sitio web puede contener enlaces a sitios web de terceros que no están bajo nuestro control. Estos enlaces se proporcionan únicamente para tu conveniencia, y no implican que respaldemos o tengamos alguna relación con los sitios enlazados.</p>
                <p>5.2. No somos responsables del contenido, políticas de privacidad, prácticas o cualquier otro aspecto de los sitios web de terceros. Te recomendamos revisar los términos y condiciones y políticas de privacidad de estos sitios antes de utilizarlos.</p>

                <p><strong>6. Limitación de Responsabilidad</strong></p>
                <p>6.1. Food Overflow no será responsable de ningún daño directo, indirecto, incidental, especial, consecuente o punitivo que resulte del uso o la imposibilidad de utilizar nuestro sitio web, incluso si hemos sido advertidos de la posibilidad de tales daños.</p>
                <p>6.2. Nuestra responsabilidad total en relación con cualquier reclamo que surja de o esté relacionado con el uso de nuestro sitio web no excederá el importe que hayas pagado, si corresponde, por el acceso a nuestro sitio web durante el período de tres meses anterior al evento que dio lugar a dicho reclamo.</p>

                <p><strong>7. Ley Aplicable y Jurisdicción</strong></p>
                <p>7.1. Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de Colombia, sin tener en cuenta sus conflictos de principios legales.</p>
                <p>7.2. Cualquier disputa relacionada con estos términos y condiciones se resolverá exclusivamente en los tribunales de Colombia.</p>

                <p><strong>8. Contacto</strong></p>
                <p>Si tienes alguna pregunta o comentario sobre estos términos y condiciones, por favor contáctanos a través de <a href={`mailto:${emailAddress}`}>{emailAddress}</a></p>
            </div>
        </div>
    )
}

export default Terms;
