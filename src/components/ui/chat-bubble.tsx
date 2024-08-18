// import React from 'react';

// const ChatBubble = ({ type, content }) => {
//   const bubbleStyles = {
//     user: 'bg-blue-500 text-white text-right',
//     assistant: 'bg-gray-200 text-gray-800',
//     error: 'bg-red-500 text-white'
//   };

//   return (
//     <div
//       className={`rounded-lg px-4 py-2 max-w-[75%] ${bubbleStyles[type]}`}
//     >
//       <p>{content}</p>
//     </div>
//   );
// };

// export default ChatBubble;

// i want it like a regular char where user mesage is on right and ai message on left


 const  ChatBubble = ({ type, content }) => {

    const bubbleStyles = {
        user: 'bg-blue-500 text-white rounded-bl-none rounded-br-lg self-end mb-2',
        assistant: 'bg-gray-200 text-gray-800 rounded-br-none rounded-bl-lg self-start mb-2',
        error: 'bg-red-500 text-white rounded-bl-none rounded-br-lg',
      };
    
    
    return (
        <div
        className={`rounded-lg px-4 py-2 max-w-[75%] ${bubbleStyles[type]}` 


        }
        >
        <p>{content}</p>
        </div>
    );
}

export default ChatBubble;
