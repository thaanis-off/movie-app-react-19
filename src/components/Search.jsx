import React from "react";

export const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search" />
        <input
          type="text0"
          placeholder="Search throught thousand of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value) }
        />
      </div>
    </div>
  );
};
