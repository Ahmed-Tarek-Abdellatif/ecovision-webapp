import { FaGithub, FaInstagram, FaFacebook, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container text-dark py-4">
      <div className="container">
        
        <div className="row align-items-center">
          {/* Contact Section */}
          <h3 className="col-md-2 fw-bold mb-3 text-start">Contact Us</h3>
          <div className="col-md-8 contact-section">
            <div className="contact-item">
              <FaMapMarkerAlt className="me-2" />
              <span>Canadian International College, Egypt, New Cairo</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="me-2" />
              <a href="mailto:bixbytv1.0@gmail.com" className="text-dark text-decoration-none">
                bixbytv1.0@gmail.com
              </a>
            </div>
            <div className="contact-item">
              <FaPhone className="me-2" />
              <a href="tel:01121015980" className="text-dark text-decoration-none">
                0112 101 5980
              </a>
            </div>
          </div>
          <div className="col-md-2 text-end">
            <img src="src/assets/Logo.png" alt="Logo" className="footer-logo" />
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="d-flex justify-content-center gap-3 mb-3 social-icons">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaGithub className="icon" />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaInstagram className="icon" />
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaFacebook className="icon" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaTwitter className="icon" />
          </a>
        </div>

        {/* Copyright */}
        <hr />
        <p className="mb-0 text-center">&copy; 2024 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
