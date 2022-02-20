import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./TextEditor.css";

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
          data={this.props.content}
          onReady={(editor) => {
            //console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            this.props.onChange(editor.getData());
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