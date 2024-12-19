import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
    return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handlePriceChange = (newRange) => {
        setPriceRange(newRange);
    };

    const filterItems = (items) => {
        return items.filter(item => 
            item.price >= priceRange[0] && 
            item.price <= priceRange[1]
        );
    };

    const value = {
        priceRange,
        handlePriceChange,
        isFilterOpen,
        toggleFilter,
        filterItems
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};
