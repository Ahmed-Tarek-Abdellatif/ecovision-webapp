import { FaGithub, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container text-dark py-4">
      <div className="container text-center">
        
        {/* Contact Section */}
        <h5 className="fw-bold mb-3">Contact Us</h5>
        <div className="row justify-content-center mb-3">
          <div className="col-md-4 d-flex align-items-center">
            <i className="bi bi-geo-alt-fill me-2"></i>
            <span>Canadian International College, Egypt, New Cairo</span>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <i className="bi bi-envelope-fill me-2"></i>
            <a href="mailto:bixbytv1.0@gmail.com" className="text-dark text-decoration-none">
              bixbytv1.0@gmail.com
            </a>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <i className="bi bi-telephone-fill me-2"></i>
            <a href="tel:01121015980" className="text-dark text-decoration-none">
              0112 101 5980
            </a>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="d-flex justify-content-center gap-3 mb-3">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaGithub />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaInstagram />
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaFacebook />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaTwitter />
          </a>
        </div>

        {/* Copyright */}
        <hr />
        <p className="mb-0">&copy; 2024 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
