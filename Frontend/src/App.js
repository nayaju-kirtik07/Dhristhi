import React from "react";
import AllRoutes from "./AllRoutes/RouteHandler";
import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { ThemeProvider } from './Context/ThemeContext';
import { CartProvider } from './Context/CartContext';
import { FilterProvider } from './Context/FilterContext';

function App() {
  return (
      <AuthProvider>
        <FilterProvider>
          <CartProvider>
            <ThemeProvider>
              <AllRoutes />
            </ThemeProvider>
          </CartProvider>
        </FilterProvider>
      </AuthProvider>
  );
}

export default App;
