import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const menu = [
    {
      title: "Product",
      icon: (
        <>
          {" "}
          <i className="fa-brands fa-product-hunt"></i>{" "}
        </>
      ),
      link: "/product",
    },
    {
      title: "Category",
      icon: (
        <>
          {" "}
          <i className="fa-solid fa-bars"></i>{" "}
        </>
      ),
      link: "/category",
    },
    {
      title: "Order",
      icon: (
        <>
          {" "}
          <i className="fa-solid fa-id-card"></i>{" "}
        </>
      ),
      link: "/orders",
    },
  
  ];

  return (
    <div className=" menu">
      <div className="heading">
        <h1 className="menu-heading py-2">
          <img
            className="main-logo"
            src="logo.svg"
            alt=""
            height="70px"
            width="70px"
          />
        </h1>
      </div>

      <div className="menu-datas">
        <div className="menu-item">
          <ul className="menu-ul ">
            <NavLink className="link-menu" to={"/home"} isactive={() => location.pathname === "/home"}>
            <li
                      className={`menu-li ${
                        location.pathname === "/home" ? "active" : ""
                      }`}
                      name="Dashboard"
                    >
                <i className="fa-solid fa-gauge"></i>{" "}
                <span className="menu-title ms-2">Dashboard</span>
              </li>
            </NavLink>
          </ul>
        </div>
        {menu
          .sort((x, y) => x.title.toLowerCase() > y.title.toLowerCase())
          .map((element, keys) => {
            const { title, icon, link } = element;
            return (
              <div className="menu-item" key={keys}>
                <ul className="menu-ul ">
                  <NavLink
                    className="link-menu"
                    to={link}
                    isactive={() => location.pathname === link}
                  >
                    <li
                      className={`menu-li ${
                        location.pathname === link ? "active" : ""
                      }`}
                      name={title}
                    >
                      {" "}
                      {icon} <span className="menu-title ms-2">{title}</span>
                    </li>
                  </NavLink>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Menu;
