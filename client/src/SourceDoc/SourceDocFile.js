import { Typography } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useState } from 'react';

export default function SourceDocFile(props){
  const [isShown, setIsShown] = useState(false);
  
  const { file, addNode } = props;
  var fileName = file.fileName;
  const {setSelectedFile} = props; 
  var displayName = '';
  var displayClass = ''; 
  if (fileName.includes('.')){
    displayClass = 'filetype'
  } else {
    fileName = '/' + fileName 
    displayClass = 'foldertype'
  }


  return (
    <div 
      className = {`SourceDocFile ${displayClass}`} 
      onClick={()=>setSelectedFile(file)}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    > 
      <div> 
      {fileName}
      </div>
      <div className='iconWrapper'>
        <AddBoxIcon fontSize='medium' onClick={()=>{addNode(file)}}/> 
      </div>
    </div>
  );
}