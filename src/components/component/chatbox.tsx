"use client"
import React, { useState, useEffect } from 'react';
import {  Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import { Select } from '@/components/ui/select';
import  ChatBubble  from '@/components/ui/chat-bubble';

 const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt');
  const [error, setError] = useState(null);

  const models = [
    { value: 'gpt', label: 'GPT' },
    { value: 'claude', label: 'Claude' },
    { value: 'davinci', label: 'Davinci' },
  ];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    try {
      // const response = await axios.post('/api/chat', {
      //   message: inputValue,
      //   model: selectedModel,
      // });
      

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', content: inputValue },
        { type: 'assistant', content: "response.data.message" },
      ]);
      setInputValue('');
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('An error occurred while sending the message.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <Select
          value={selectedModel}
          onChange={handleModelChange}
          options={models}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              type={message.type}
              content={message.content}
            />
          ))}
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4 flex">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 mr-2"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;