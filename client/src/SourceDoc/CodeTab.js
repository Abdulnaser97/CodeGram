import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function CodeTab({
    rawCode
}) {
    return (
        <SyntaxHighlighter
            showLineNumbers={true}
            wrapLongLines={true} 
        >
            {rawCode}
        </SyntaxHighlighter>
    );
};