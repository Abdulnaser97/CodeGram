import { Typography } from "@mui/material";
import { theme } from "../Themes";

import searchIcon from "../Media/SearchBarIcon.svg";

function SearchBar({
    handleSearch,
    setTabValue,
}) {

    return (
        <div
            style={{
              display: "flex",
              flexDirection: "row",
            //   width: "auto",
            }}
          >
            <div className="SourceDocMinimize" />

            {/* <Typography
              fontSize={"14px"}
              color={"primary.main"}
              fontWeight={"medium"}
              mx={1}
              my={0}
              minWidth={"max-content"}
            >
              {"Search >"}
            </Typography> */}
            <div className="search-bar">
                <img className="search-icon" src={searchIcon}/>
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
                        fontWeight: theme.typography.fontWeightMedium,
                    }}
                />
            </div>
          </div>
    );
}

export default SearchBar;
