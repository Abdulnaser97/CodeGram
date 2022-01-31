import react, { useState } from "react";
// import Highlight from 'react-highlight';
import {Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import apache from 'react-syntax-highlighter/dist/esm/languages/hljs/apache';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import r from 'react-syntax-highlighter/dist/esm/languages/hljs/r';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import "../../node_modules/highlight.js/styles/a11y-light.css";

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('apache', apache);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('r', r);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('cpp', cpp);

export default function CodeTab({
    rawCode
}) {

    return (
        // <Highlight>
        //     {rawCode}
        // </Highlight>
        <SyntaxHighlighter
            language="cpp"
            showLineNumbers={true}
            wrapLongLines={true} 
        >
            {rawCode}
        </SyntaxHighlighter>
    );
};
