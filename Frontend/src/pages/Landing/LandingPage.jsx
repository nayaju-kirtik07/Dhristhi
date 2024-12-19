import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import CustomSnackbar from "../../Components/CustomSnackbar/CustomSnackbar";
import { useCart } from "../../Context/CartContext";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const LandingPage = () => {
  const navigate = useNavigate();
  const images = {
    heroBackground:
      "images/drishti.png",
    deepBlack:
      "images/wireless.png",
    latte: "https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg",
    cubano:
      "https://images.pexels.com/photos/1233528/pexels-photo-1233528.jpeg",
    chocolateCake:
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    cheesecake:
      "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg",
    tiramisu:
      "https://images.pexels.com/photos/6133305/pexels-photo-6133305.jpeg",
  };

  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { addToCart } = useCart();

  const specialItems = [
    {
      id: 1,
      name: "Wireless Camera",
      description: "Remote Accessible 360 Rotating Camera",
      price: 6500,
      image: "images/wireless.png",
    },
    {
      id: 2,
      name: "GPS Tracker",
      description: "Electronic GPS Tracker",
      price: 4000,
      image: "images/gpstracker.png",
    },
    {
      id: 2,
      name: "Smoke Alarm",
      description: "Smart Smoke Detector and Alarm",
      price: 6500,
      image: "images/smartsmokedetector.png"
    },
  ];

  const testimonials = [
    {
      content:
        "One of the finest services providing company. Really liked their service.",
      author: "Anupam Vidya Sadan",
      role: "Principal",
    },
    {
      content:
        "Their quality products are amazing. They are so friendly and the service is quick!",
      author: "ROBAM Nepal",
      role: "Director",
    },
    {
      content:
        "The products were way more better than expected. Liked it!",
      author: "Step Up Kitchen",
      role: "Founder",
    },
    {
      content:
        "Would really like to give 5 stars for the professional installation and amazing quality.",
      author: "Synergy Enterprises",
      role: "CEO",
    },
    {
      content:
        "Their focus in every detailed installation in every point makes this quality special. Highly recommended!",
      author: "Club Faranheit",
      role: "Managing Director",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const nextSlide = () => {
  //   setCurrentSlide((prev) =>
  //     prev === testimonials.length - slidesToShow ? 0 : prev + 1
  //   );
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) =>
  //     prev === 0 ? testimonials.length - slidesToShow : prev - 1
  //   );
  // };

  useEffect(() => {
    if (location.state?.showLoginSuccess) {
      setSnackbar({
        open: true,
        message: `Welcome back, ${location.state.username}! 👋`,
        severity: "success",
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleOrderClick = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setSnackbar({
      open: true,
      message: "Item added to cart successfully! 🛒",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <section
          className="hero-section"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                url(${images.heroBackground}) center/cover no-repeat`,
          }}
        >
          <h1>Securing what matters the most!</h1>
          <button className="cta-button" onClick={() => navigate("/products")}>
            Explore Products
          </button>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <img src="images/wireless.png" alt="" srcset="" height="80px" width="80px" />
            </div>
            <h3>Wireless Cameras</h3>
            <p>
            Stay secure with our advanced wireless CCTV cameras, 
            offering clear visuals and effortless monitoring.
            </p>
          </div>
          <div className="feature-card">
              <img src="images/gallerycamera2.png" alt="" srcset="" height="80px" width="80px" />
            <div className="feature-icon"> </div>
            <h3>Wired Cameras</h3>
            <p>
            Reliable and durable, our wired CCTV cameras deliver consistent, 
            high-quality surveillance for complete peace of mind.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
            <img src="images/gpstracker.png" alt="" srcset="" height="80px" width="80px" />

            </div>
            <h3>GPS Tracker</h3>
            <p>
            Track with precision and stay connected, our GPS trackers offer 
            real-time location monitoring for vehicles, assets, and more.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
            <img src="images/smartsmokedetector.png" alt="" srcset="" height="80px" width="80px" />

            </div>
            <h3>Smoke Detector</h3>
            <p>
            Ensure safety with our reliable smoke detectors, providing 
            early warning and 
            peace for your home or business.
            </p>
          </div>
        </section>

        <section className="specials-section">
          <h2>Most Trendings</h2>
          <div className="specials-container">
            {specialItems.map((item) => (
              <div key={item.id} className="special-card">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="special-footer">
                  <span className="price">Rs. {item.price}</span>
                  <button
                    className="order-button"
                    onClick={() => handleOrderClick(item)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        
        <section className="testimonials-section">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-container">
            <div className="testimonials-slider">
              {testimonials
                .slice(currentSlide, currentSlide + slidesToShow)
                .map((testimonial, index) => (
                  <div
                    key={currentSlide + index}
                    className="testimonial-card"
                    style={{
                      animation: "slideIn 0.8s ease-out forwards",
                    }}
                  >
                    <div className="testimonial-content">
                      <p>{testimonial.content}</p>
                    </div>
                    <div className="testimonial-author">
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="slider-dots">
              {[...Array(testimonials.length - slidesToShow + 1)].map(
                (_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot ${
                      currentSlide === idx ? "active" : ""
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                )
              )}
            </div>
          </div>
        </section>

        <footer className="footer-section">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-info">
                <h3>Drishti Surveillances</h3>
                <p>
                Where Cutting-Edge Technology Meets Trusted Security.
                </p>
                <div className="social-links">
                  <a href="https://www.facebook.com/profile.php?id=61562110497252&mibextid=ZbWKwL" aria-label="Facebook">
                    <FacebookIcon />
                  </a>
                  <a href="https://www.instagram.com/drishti_surveillances?igsh=MW5lbGJlMzNzNWY3Zg==" aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                  <a href="#" aria-label="Twitter">
                    <TwitterIcon />
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <LinkedInIcon />
                  </a>
                </div>
              </div>

              <div className="footer-links">
                <div className="link-group">
                  <h4>Quick Links</h4>
                  <ul>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/contact">Contact</a>
                    </li>
                  </ul>
                </div>

                <div className="link-group">
                  <h4>Visit Us</h4>
                  <ul>
                    <li>
                      <LocationOnIcon className="footer-icon" /> Lazimpat, Kathmandu
                    </li>
                    <li>Near Big Mart</li>
                    <li>
                      <PhoneIcon className="footer-icon" /> +977-9802260017
                    </li>
                    <li>
                      <EmailIcon className="footer-icon" /> info@drishtisurv.com
                    </li>
                  </ul>
                </div>

                <div className="link-group">
                  <h4>Opening Hours</h4>
                  <ul>
                    <li>
                      <AccessTimeIcon className="footer-icon" /> Monday - Friday
                    </li>
                    <li>10:00 AM - 6:00 PM</li>
                    <li>
                      <AccessTimeIcon className="footer-icon" /> Saturday -
                      Sunday
                    </li>
                    <li>12:00 PM - 5:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="newsletter-section">
              <h4>Subscribe to Our Newsletter</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button className="subscribe-btn">Subscribe</button>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2024 Drishti Surveillances. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default LandingPage;
