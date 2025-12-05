'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown-like content as styled HTML
 * Supports: bold, italic, headers, lists, tables, code blocks
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderContent = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    const lines = text.split('\n');
    let i = 0;
    let tableBuffer: string[] = [];
    let inTable = false;

    while (i < lines.length) {
      const line = lines[i];

      // Check for table start (line with |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableBuffer = [];
        }
        tableBuffer.push(line);
        i++;
        continue;
      } else if (inTable) {
        // End of table
        elements.push(renderTable(tableBuffer, elements.length));
        tableBuffer = [];
        inTable = false;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={elements.length} className="text-lg font-semibold mt-4 mb-2 text-white">
            {parseInlineFormatting(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={elements.length} className="text-xl font-semibold mt-4 mb-2 text-white">
            {parseInlineFormatting(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={elements.length} className="text-2xl font-bold mt-4 mb-2 text-white">
            {parseInlineFormatting(line.slice(2))}
          </h1>
        );
      }
      // Bullet points
      else if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        const indent = line.search(/\S/);
        const bulletContent = line.trim().slice(2);
        elements.push(
          <div key={elements.length} className="flex items-start gap-2 my-1" style={{ marginLeft: `${indent * 4}px` }}>
            <span className="text-purple-400 mt-1">•</span>
            <span>{parseInlineFormatting(bulletContent)}</span>
          </div>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={elements.length} className="flex items-start gap-2 my-1">
              <span className="text-purple-400 font-medium min-w-[1.5rem]">{match[1]}.</span>
              <span>{parseInlineFormatting(match[2])}</span>
            </div>
          );
        }
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={elements.length} className="bg-black/50 rounded-lg p-3 my-2 overflow-x-auto text-sm">
            <code className="text-green-400">{codeLines.join('\n')}</code>
          </pre>
        );
      }
      // Inline code
      else if (line.includes('`')) {
        elements.push(
          <p key={elements.length} className="my-1">
            {parseInlineFormatting(line)}
          </p>
        );
      }
      // Empty line
      else if (line.trim() === '') {
        elements.push(<div key={elements.length} className="h-2" />);
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={elements.length} className="my-1">
            {parseInlineFormatting(line)}
          </p>
        );
      }

      i++;
    }

    // Handle remaining table
    if (inTable && tableBuffer.length > 0) {
      elements.push(renderTable(tableBuffer, elements.length));
    }

    return elements;
  };

  const renderTable = (tableLines: string[], key: number): React.ReactNode => {
    if (tableLines.length < 2) return null;

    const parseRow = (line: string): string[] => {
      return line
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim());
    };

    const headers = parseRow(tableLines[0]);
    
    // Skip separator line (contains ---)
    const dataStartIndex = tableLines[1].includes('---') ? 2 : 1;
    const rows = tableLines.slice(dataStartIndex).map(parseRow);

    return (
      <div key={key} className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20">
              {headers.map((header, i) => (
                <th key={i} className="text-left py-2 px-3 font-semibold text-purple-300">
                  {parseInlineFormatting(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/10 hover:bg-white/5">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-2 px-3 text-gray-300">
                    {parseInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const parseInlineFormatting = (text: string): React.ReactNode => {
    if (!text) return text;

    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = 0;

    // Process inline formatting
    while (remaining.length > 0) {
      // Bold: **text** or __text__
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
      const boldMatch2 = remaining.match(/^(.*?)__(.+?)__/);
      
      // Italic: *text* or _text_
      const italicMatch = remaining.match(/^(.*?)\*([^*]+?)\*/);
      const italicMatch2 = remaining.match(/^(.*?)_([^_]+?)_/);
      
      // Inline code: `code`
      const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);

      // Find the earliest match
      const matches = [
        { match: boldMatch, type: 'bold', pattern: /\*\*(.+?)\*\*/ },
        { match: boldMatch2, type: 'bold', pattern: /__(.+?)__/ },
        { match: codeMatch, type: 'code', pattern: /`([^`]+)`/ },
      ].filter(m => m.match !== null);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      // Get the match that appears first
      const firstMatch = matches.reduce((prev, curr) => {
        const prevIndex = prev.match![1].length;
        const currIndex = curr.match![1].length;
        return prevIndex <= currIndex ? prev : curr;
      });

      const match = firstMatch.match!;
      
      // Add text before the match
      if (match[1]) {
        parts.push(match[1]);
      }

      // Add formatted text
      if (firstMatch.type === 'bold') {
        parts.push(
          <strong key={keyCounter++} className="font-semibold text-white">
            {match[2]}
          </strong>
        );
      } else if (firstMatch.type === 'code') {
        parts.push(
          <code key={keyCounter++} className="bg-black/50 px-1.5 py-0.5 rounded text-purple-300 text-sm">
            {match[2]}
          </code>
        );
      }

      // Continue with remaining text
      remaining = remaining.slice(match[0].length);
    }

    return parts.length === 1 ? parts[0] : parts;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {renderContent(content)}
    </div>
  );
}
