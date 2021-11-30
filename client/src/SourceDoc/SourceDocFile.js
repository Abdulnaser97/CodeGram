
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function SourceDocFile(props){
  
  const { file, addNode, setSelectedFile, selectedFile } = props;

  var fileName = file.fileName;
  var displayClass = ''; 
  if (fileName.includes('.')){
    displayClass = 'filetype'
  } else {
    fileName = '/' + fileName 
    displayClass = 'foldertype'
  }

  var selected = selectedFile === file ? 'selected' : ''; 

  return (
    <div 
      className = {`SourceDocFile ${displayClass} ${selected} `} 
      onClick={()=>setSelectedFile(file)}
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