import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 menu-field">
          <Menu />
        </div>

        <div className="col-10 table-field">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
