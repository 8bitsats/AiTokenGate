import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);

interface TerminalOutputProps {
  output: {
    content: string;
    type: 'success' | 'error' | 'info' | 'json';
    timestamp: number;
  }[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ output }) => {
  const renderOutput = (content: string, type: string) => {
    if (type === 'json') {
      try {
        const jsonData = JSON.parse(content);
        return (
          <SyntaxHighlighter
            language="json"
            style={atomOneDark}
            customStyle={{ background: 'transparent' }}
          >
            {JSON.stringify(jsonData, null, 2)}
          </SyntaxHighlighter>
        );
      } catch {
        return <span className="command-error">Invalid JSON</span>;
      }
    }

    return (
      <span className={`command-${type}`}>
        {content}
      </span>
    );
  };

  return (
    <div className="terminal-output">
      {output.map((line, index) => (
        <div key={line.timestamp + index} className="mb-2">
          {renderOutput(line.content, line.type)}
        </div>
      ))}
    </div>
  );
};