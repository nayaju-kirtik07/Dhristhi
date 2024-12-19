import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("detail");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div>
        <nav className="navbar navbar-expand-lg fixed-top">
          <Link className="navbar-brand ps-2" to="/home">
            <span>
              {/* <img src="creatu_logo.png" alt="" height="40px" width="40px" /> */}
            </span>{" "}
            Dristhi Surveillance    
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse d-flex"
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav ms-auto pe-5">
              <Link onClick={(e) => handleLogOut(e)} className="nav-link">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                <span>Log Out</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
