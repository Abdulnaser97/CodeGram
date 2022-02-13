import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import apache from "react-syntax-highlighter/dist/esm/languages/hljs/apache";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import kotlin from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import r from "react-syntax-highlighter/dist/esm/languages/hljs/r";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import htmlbars from "react-syntax-highlighter/dist/esm/languages/hljs/htmlbars";

import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("apache", apache);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("r", r);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("htmlbars", htmlbars);

function getLangFromFilename(filename) {
  // Extract the extension from the filename
  const ext = filename.split(".").pop();
  // Return the language name
  switch (ext) {
    case "js":
      return "javascript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "kt":
      return "kotlin";
    case "r":
      return "r";
    case "php":
      return "php";
    case "c":
      return "c";
    case "h":
        return "c";
    case "go":
      return "go";
    case "swift":
      return "swift";
    case "cs":
      return "csharp";
    case "json":
      return "json";
    case "ts":
      return "typescript";
    case "css":
      return "css";
    case "cpp":
      return "cpp";
    case "html":
      return "htmlbars";
    default:
      return "plaintext";
  }
}

function CodeTab({ rawCode, fileName }) {
  const lang = getLangFromFilename(fileName);
  console.log(lang);
  // If json, then stringify it
  if (lang === "json") {
    rawCode = JSON.stringify(rawCode, null, 2);
  }

  return (
    <SyntaxHighlighter
      language={lang}
      style={a11yLight}
      showLineNumbers={true}
      wrapLongLines={true}
    >
      {rawCode}
    </SyntaxHighlighter>
  );
}

export default CodeTab;
