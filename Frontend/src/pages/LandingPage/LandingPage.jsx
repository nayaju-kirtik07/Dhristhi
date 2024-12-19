import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const specialItems = [
    {
      id: 1,
      name: "Smart Door Bell",
      description: "A doorbell with a camera and two-way audio, allowing you to see and communicate with visitors remotely via a smartphone app.",
      price: 150,
      image: "https://flightsquadelitef.eu/images/6e5a1770.png",
    },
    {
      id: 2,
      name: "Smart Door Lock",
      description: "Keyless entry with remote control and monitoring through a smartphone app, offering features like timed access and guest entry.",
      price: 350,
      image: "https://portfoliocoffee.ca/cdn/shop/articles/A_Guide_to_Caramel_Macchiato_-_Facts_Variations_and_Recipe.jpg?v=1657026128",
    },
    {
      id: 3,
      name: "Smart Smoke Detector",
      description: "Smoke alarms that send real-time alerts to your phone when smoke is detected, along with remote testing and monitoring capabilities.",
      price: 350,
      image: "https://ik.imagekit.io/jq1luxum6oz/https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/HazelnutLatteHot62629b.jpg?tr=,h-1000",
    }
  ];

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Experience the Perfect Cup</h1>
            <p>Discover our handcrafted coffee and delightful treats</p>
            <button className="cta-button" onClick={() => navigate("/menu")}>
              View Menu
            </button>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <div className="feature-card">
              <h3>Premium Quality</h3>
              <p>Sourced from the finest coffee beans around the world</p>
            </div>
            <div className="feature-card">
              <h3>Fresh & Organic</h3>
              <p>Always fresh, always organic, always delicious</p>
            </div>
            <div className="feature-card">
              <h3>Expert Baristas</h3>
              <p>Crafted by passionate coffee artisans</p>
            </div>
          </div>
        </section>

        <section className="specials-section">
          <h2>Today's Specials</h2>
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
                    onClick={() => navigate('/menu')}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Visit Us</h2>
              <h3>Location</h3>
              <p>123 Coffee Street, Kathmandu, Nepal</p>
              <h3>Hours</h3>
              <p>Monday - Friday: 7am - 8pm</p>
              <p>Saturday - Sunday: 8am - 9pm</p>
              <h3 className="phone">+977 9876543210</h3>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage; 