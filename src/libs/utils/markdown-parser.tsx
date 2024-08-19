import React from 'react';
import Markdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import remarkGfm from 'remark-gfm';
import CodeBlockComponent from "@/components/ui/code-block";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism'



// Helper function to safely stringify content
const safeStringify = (content: any): string => {
  if (typeof content === 'string') return content;
  try {
    return JSON.stringify(content, null, 2);
  } catch (error) {
    console.error('Failed to stringify content:', error);
    return String(content);
  }
};

export function renderMessageContent(content: any) {
  const stringContent = safeStringify(content);

  return (
    <Markdown
    // eslint-disable-next-line react/no-children-prop
     className=''
    // eslint-disable-next-line react/no-children-prop
    children={content}
    components={{
      code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            language={match[1]}
            style={a11yDark}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code {...rest} className={`${" "} text-red-400 italic ` }>
            {children}
          </code>
        )
      }
    }}
  />
  );
}