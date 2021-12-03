import AddBoxIcon from "@mui/icons-material/AddBox";

export default function SourceDocFile(props) {
  const { file, addNode, setSelectedFile, selectedFile } = props;

  var fileName = file.fileName;
  var displayClass = "";
  if (fileName.includes(".")) {
    displayClass = "filetype";
  } else {
    fileName = "/" + fileName;
    displayClass = "foldertype";
  }

  var selected = selectedFile === file ? "selected" : "";

  return (
    <div
      className={`SourceDocFile ${displayClass} ${selected} `}
      onClick={() => setSelectedFile(file)}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            "font-family": "Poppins-Bold",
            "font-size": "70%",
            color: "#25252",
          }}
        >
          {fileName}
        </p>
      </div>
      <div className="iconWrapper">
        <AddBoxIcon
          fontSize="small"
          onClick={() => {
            addNode(file);
          }}
        />
      </div>
    </div>
  );
}
