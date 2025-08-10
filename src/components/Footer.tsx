
import '../styles/Footer.css';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
// import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
// import RoomIcon from '@mui/icons-material/Room';
import logo from '../images/ygames-logo.png';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <h2 className="footer-logo">

                    <Link to="/">
                        <img src={logo} alt="Logo" className="logo-imgF" />
                    </Link>
                </h2>
                <p>
                    Votre destination pour les meilleurs jeux consoles et accessoires.
                    <br />
                    Qualité, rapidité, fiabilité pour une expérience gaming incomparable.
                </p>
                <div className="footer-contact">
                    <p><EmailIcon className="icon" /> email@gmail.com</p>
                    <p><PhoneIcon className="icon" /> 0546777778</p>
                </div>
            </div>

            <div className="footer-section">
                <h3>Horaires</h3>
                <p>Dimanche – Jeudi : 9h00 – 18h00</p>
                <p>Vendredi : Fermé</p>
                <p>Samedi : 10h00 – 14h00</p>
            </div>

            <div className="footer-section">
                <h3>Suivez-nous</h3>
                <div className="footer-socials">
                    {/* <Link to="https://www.instagram.com/y_games__/?fbclid=IwY2xjawMAPtpleHRuA2FlbQIxMABicmlkETFkQ3EzbEJOa2x2dUFsSGVGAR7hK2J42k9-Xhb_3y3HLLXZlKB_1mvMc-r3A2jACrikC13ECZjcQVUrWDpHlA_aem_r_J-pLgNbFsBdI4q3ATkZA"><FacebookIcon className="social-icon" /></Link> */}
                    <Link to="https://www.instagram.com/y_games__/?fbclid=IwY2xjawMAPtpleHRuA2FlbQIxMABicmlkETFkQ3EzbEJOa2x2dUFsSGVGAR7hK2J42k9-Xhb_3y3HLLXZlKB_1mvMc-r3A2jACrikC13ECZjcQVUrWDpHlA_aem_r_J-pLgNbFsBdI4q3ATkZA"><InstagramIcon className="social-icon" /></Link>
                </div>
            </div>

            <div className="footer-map">

                <iframe
                    title="Google Map - Y Games"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.011084919929!2d-1.324250124786143!3d34.87811197367396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd78c94fb48fb8ed%3A0x8ed6cef310c13777!2sY%20Games!5e1!3m2!1sfr!2sus!4v1753230533897!5m2!1sfr!2sus"
                    width="250"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />


            </div>
        </footer>
    );
};

export default Footer;
