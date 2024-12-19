import React from "react";
import { useLocation } from "react-router-dom";
import {
  Drawer,
  Typography,
  Slider,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFilter } from "../../Context/FilterContext";
import "./Filter.css";

const Filter = () => {
  const { isFilterOpen, toggleFilter, priceRange, handlePriceChange } =
    useFilter();
  const location = useLocation();


  if (location.pathname !== "/menu") return null;

  return (
    <Drawer
      anchor="right"
      open={isFilterOpen}
      onClose={toggleFilter}
      className="filter-drawer"
    >
      <Box className="filter-container">
        <Box className="filter-header">
          <Typography variant="h6" className="filter-title">
            Filter Options
          </Typography>
          <IconButton onClick={toggleFilter} className="close-button">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className="filter-content">
          <Typography variant="subtitle1" className="price-label">
            Price Range
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => handlePriceChange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={50}
            className="price-slider"
          />
          <Box className="price-range-display">
            <Typography>
              Rs. {priceRange[0]} - Rs. {priceRange[1]}
            </Typography>
          </Box>
        </Box>

        <Box className="filter-actions">
          <Button
            variant="contained"
            className="apply-filter"
            onClick={toggleFilter}
          >
            Filter
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Filter;
