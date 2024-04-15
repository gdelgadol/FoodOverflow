import Logo_about_us from '../assets/Logo_about_us.png';
import logo_github from '../assets/github.png';
import logo_linkedin from '../assets/linkedin.png';
import "./AboutUs.css"
function AboutUs() {
    return (
        <div className='au-container'>
            <div className='au-logo-eslogan'>
                <img
                alt="Logo de Food Overflow"
                src={Logo_about_us}
                className='au-logo'
                />
                <div className='au-eslogan'>
                    <span className="au-name-text">Food Overflow</span>
                    <h1 className="au-eslogan-text">La web que permite el intercambio de recetas culinarias y resolver todas tus dudas de la cocina.</h1>
                </div>
            </div>
            <div className='au-vision-mision'>
                <div className='au-vision-mision-container'>
                    <span className='au-vision-mision-title'>Visión</span>
                    <h1 className='au-vision-mision-text'>En los siguientes 5 años, Food Overflow será una de las principales plataformas que conectan a la comunidad
                    gastronómica para que compartan recetas, aprendan nuevas técnicas, descubran sabores y celebren el amor
                    por la comida con solidaridad, respeto y colaboración.</h1>
                </div>
                <div className='au-vision-mision-container'>
                    <span className='au-vision-mision-title'>Misión</span>
                    <h1 className='au-vision-mision-text'>Unificar el amplio conocimiento gastronómico en un foro donde todos los interesados, desde cocineros expertos
                    hasta cocineros en casa, puedan compartir ideas, resolver dudas y adentrarse en el mundo de la comida.</h1>
                </div>
            </div>
            <div className='au-team-container'>
                <h1>Conoce al equipo</h1>
                <div className='au-team-members'>
                    <div className='au-member'>
                        <img
                        alt="Logo de Food Overflow"
                        src="https://avatars.githubusercontent.com/u/130797033?s=400&u=ad8926bdc2a317120e99bf2b85ed49e014b37862&v=4"
                        className='au-member-image'
                        />
                        <span className='au-member-name'>Juan Ovalle</span>
                        <h1 className='au-member-title'>Desarrollador Frontend</h1>
                        <div className='au-member-social'>
                            <a href="https://github.com/JOvalleG">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_github}
                                className='au-social-icon'
                                />
                            </a>
                            <a href="https://www.linkedin.com/">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_linkedin}
                                className='au-social-icon'
                                />
                            </a>
                        </div>
                    </div>
                    <div className='au-member'>
                        <img
                        alt="Logo de Food Overflow"
                        src="https://avatars.githubusercontent.com/u/102488389?v=4"
                        className='au-member-image'
                        />
                        <span className='au-member-name'>Gabriel Delgado</span>
                        <h1 className='au-member-title'>Desarrollador Backend</h1>
                        <div className='au-member-social'>
                            <a href="https://github.com/gdelgadol">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_github}
                                className='au-social-icon'
                                />
                            </a>
                            <a href="https://www.linkedin.com/in/gdelgadol">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_linkedin}
                                className='au-social-icon'
                                />
                            </a>
                        </div>
                    </div>
                    <div className='au-member'>
                        <img
                        alt="Logo de Food Overflow"
                        src="https://avatars.githubusercontent.com/u/86687725?v=4"
                        className='au-member-image'
                        />
                        <span className='au-member-name'>Andres Ardila</span>
                        <h1 className='au-member-title'>Desarrollador Web</h1>
                        <div className='au-member-social'>
                            <a href="https://github.com/AndresArdila05">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_github}
                                className='au-social-icon'
                                />
                            </a>
                            <a href="https://www.linkedin.com/in/andres-camilo-ardila-diaz-13a1162a5/">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_linkedin}
                                className='au-social-icon'
                                />
                            </a>
                        </div>
                    </div>
                    <div className='au-member'>
                        <img
                        alt="Logo de Food Overflow"
                        src="https://avatars.githubusercontent.com/u/69327674?v=4"
                        className='au-member-image'
                        />
                        <span className='au-member-name'>Jhon Moreno</span>
                        <h1 className='au-member-title'>Desarrollador Backend</h1>
                        <div className='au-member-social'>
                            <a href="https://github.com/Jh0mpis">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_github}
                                className='au-social-icon'
                                />
                            </a>
                            <a href="https://www.linkedin.com/in/jhon-sebastian-moreno-triana-b8a964257/">
                                <img
                                alt="Logo de Food Overflow"
                                src={logo_linkedin}
                                className='au-social-icon'
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs