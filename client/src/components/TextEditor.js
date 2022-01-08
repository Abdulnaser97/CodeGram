import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class TextEditor extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  //shouldComponentUpdate(nextProps, nextState) {}

  render() {
    return (
      <div className="text-editor" onClick={this.focusEditor}>
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {
            //console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log( { event, editor, data } );
          }}
          onBlur={(event, editor) => {
            //console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            //console.log("Focus.", editor);
          }}
        />
      </div>
    );
  }
}

export default TextEditor;