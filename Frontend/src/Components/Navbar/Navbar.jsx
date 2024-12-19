import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  TextField,
  InputAdornment,
  Box,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./Navbar.css";
import { useAuth } from "../../Context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "../ThemeToggle/ThemeToggle.css";
import { useCart } from "../../Context/CartContext";
import Cart from "../../pages/Cart/Cart";
import { useFilter } from "../../Context/FilterContext";
import Filter from "../Filter/Filter";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleCart, getTotalItems } = useCart();
  const { toggleFilter } = useFilter();

  useEffect(() => {
    const handleScroll = () => {
      const appBar = document.querySelector(".app-bar");
      if (window.scrollY > 50) {
        appBar.classList.add("scrolled");
      } else {
        appBar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <div className="mobile-menu">
      <div className="drawer-header">
        <Typography variant="h6" className="drawer-title">
          Drishti Surveillance
        </Typography>
        <IconButton onClick={handleDrawerToggle} className="drawer-close">
          <CloseIcon />
        </IconButton>
      </div>
      <List className="mobile-menu-list">
        <ListItem>
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            className="search-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </ListItem>
        <ListItem>
          <Button
            className="mobile-nav-button"
            fullWidth
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        </ListItem>
        <ListItem>
          <Button
            className="mobile-nav-button"
            fullWidth
            onClick={() => navigate("/products")}
          >
            Products
          </Button>
        </ListItem>
        <ListItem>
          <Button
            className="mobile-nav-button"
            fullWidth
            onClick={() => navigate("/contact")}
          >
            Contact
          </Button>
        </ListItem>
        <ListItem className="mobile-theme-toggle">
          <ThemeToggle />
        </ListItem>
        <ListItem>
          {user ? (
            <Button
              className="mobile-nav-button"
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="mobile-nav-button"
              fullWidth
              onClick={() => navigate("/login")}
            >
              Sign Up
            </Button>
          )}
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" className="app-bar">
        <Toolbar className="toolbar">
          <Typography
            variant="h6"
            className="logo-text"
            fontFamily="Playfair Display"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Drishti Surveillance
          </Typography>

          <Stack direction="row" spacing={2} className="right-nav">
            <div className="nav-buttons-group">
              <Button className="nav-button" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button className="nav-button" onClick={() => navigate("/products")}>
                Products
              </Button>
              <Button
                className="nav-button"
                onClick={() => navigate("/contact")}
              >
                Contact
              </Button>
            </div>

            <TextField
              className="search-input"
              variant="outlined"
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {location.pathname === "/menu" && (
              <IconButton className="filter-icon" onClick={toggleFilter}>
                <FilterListIcon />
              </IconButton>
            )}
            <IconButton className="cart-icon" onClick={toggleCart}>
              <Badge badgeContent={getTotalItems()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <ThemeToggle />

            {user ? (
              <Button onClick={handleLogout} className="navbar-signup-button">
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="navbar-signup-button"
              >
                Sign Up
              </Button>
            )}
          </Stack>

          <Box className="mobile-icons">
            {location.pathname === "/menu" && (
              <IconButton className="filter-icon" onClick={toggleFilter}>
                <FilterListIcon />
              </IconButton>
            )}
            <IconButton className="cart-icon" onClick={toggleCart}>
              <Badge badgeContent={getTotalItems()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-icon"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          className="mobile-drawer"
        >
          {drawer}
        </Drawer>
      </AppBar>
      <Cart />
      <Filter />
    </>
  );
};

export default Navbar;
