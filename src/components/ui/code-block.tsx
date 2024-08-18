import { CodeBlock, dracula } from 'react-code-blocks';

// export function CodeBlock({ code }: { code: string }) {
//   return (
//     <pre className="bg-gray-900 text-white rounded p-4 overflow-auto">
//       <code>{code}</code>
//     </pre>
//   );
// }

export default function CodeBlockComponent({ language, value }: { value: string, language:string }) {
  return (
    <CodeBlock
      text={value}
      language={"language"}
      showLineNumbers={true}
      theme={dracula}
    />
  );
}