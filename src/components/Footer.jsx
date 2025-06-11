import {
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container">
        <div className="row align-items-center">
          {/* Contact Section */}
          <div className="col-md-4 contact-section">
            <h3 className="fw-bold mb-3">Contact Us</h3>
            <div className="contact-item">
              <FaMapMarkerAlt className="me-2" />
              <span>Canadian International College, Egypt, New Cairo</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="me-2" />
              <a href="mailto:bixbytv1.0@gmail.com">bixbytv1.0@gmail.com</a>
            </div>
            <div className="contact-item">
              <FaPhone className="me-2" style={{ transform: 'scaleX(-1)' }} />
              <a href="tel:01121015980">0112 101 5980</a>
            </div>
          </div>

          {/* Logo Section */}
          <div className="col-md-4 text-center">
            <img src="src/assets/Logo.png" alt="Logo" className="footer-logo" />
          </div>

          {/* Social Media Icons */}
          <div className="col-md-4 text-center">
            <h3 className="fw-bold mb-3">Follow Us</h3>
            <div className="social-icons">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr />
        <p className="text-center mt-3">&copy; 2024 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;