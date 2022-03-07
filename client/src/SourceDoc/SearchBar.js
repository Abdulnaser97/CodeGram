import { Typography } from "@mui/material";
import { theme } from "../Themes";

import searchIcon from "../Media/SearchBarIcon.svg";

function SearchBar({ handleSearch, setTabValue }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div className="SourceDocMinimize" />
      <div className="search-bar">
        <img className="search-icon" src={searchIcon} />
        <input
          className="search-input"
          placeholder="Search Repo Content"
          onChange={handleSearch}
          onKeyPress={handleSearch}
          onClick={() => setTabValue(0)}
          style={{
            "z-index": 0,
            border: "none",
            boxShadow: 6,
            fontSize: "14px",
            outline: "none",
            fontWeight: theme.typography.fontWeightBold,
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.darkestGrey,
          }}
        />
      </div>
    </div>
  );
}

export default SearchBar;
