import AddBoxIcon from "@mui/icons-material/AddBox";
import { ListItem } from "@mui/material";
import { display } from "@mui/system";

export default function SourceDocFile(props) {
  const { addNode, setOpenArtifact, openArtifact } = props;
  var { file } = props; 

  // search results from fuse are returned as items
  file = file.item ? file.item : file 

  var fileName = file.name 
  var displayClass = "";

  // cstyle lass rendering 
  if (file.type !== "dir") {
    displayClass = "filetype";
  } else {
    fileName = "/" + fileName;
    displayClass = "foldertype";
  }


  // openArtifact must exist to match names 
  var selected = openArtifact && openArtifact.name === file.name ? "selectedFile" : "";

  displayClass = selected ? "" : displayClass 
  
  function fileClickHandler(file){ 
    setOpenArtifact(file)  
  }

  return (
    <div
      className={`SourceDocFile ${displayClass} ${selected} `}
      >
      <div 
      onClick={() => fileClickHandler(file)}
      style = {{width:"100%", height:"100%", padding:0}}> 
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
        >
        <p
          style={{
            fontFamily: "Poppins-Bold",
            "font-size": "70%",
            color: "#25252",
            margin:0
          }}
          >
          {fileName}
        </p>
          
      </div>
      </div>
      <div className="iconWrapper">
        <AddBoxIcon
          fontSize="small"
          onClick={() => {
            addNode(file);
            setOpenArtifact(file)
          }}
        />
      </div>
    </div>
  );
}
