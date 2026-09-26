import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import "./Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your Movie Assistant. Ask me about movies or TV shows."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const apiKey = "AQ.Ab8RN6L93RkInAayaXLijfFmBuxvyYVK5J-AV1dJBnAfQ6ypXg";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  async function sendMessage() {
    if (input.trim() === "" || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: input
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey
      });

      const conversation = newMessages.map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [
          {
            text: message.text
          }
        ]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: conversation,

        config: {
          systemInstruction: `
            You are an AI Movie Assistant.

            You ONLY answer questions related to movies and TV shows.

            You can:
            - Recommend movies.
            - Recommend TV shows.
            - Answer questions about movies.
            - Suggest movies similar to another movie.
            - Discuss movie genres.
            - Give movie summaries.
            - Explain movie endings.
            - Answer questions about actors.
            - Answer questions about directors.
            - Discuss movie characters.

            If the user asks about something unrelated
            to movies or TV shows, politely say:

            "I'm a movie assistant, so I can only help
            with movie and TV-related questions."
          `
        }
      });

      console.log("Gemini response:", response);
      console.log("Gemini text:", response.text);

      const aiMessage = {
        role: "assistant",
        text: response.text
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage
      ]);

    } catch (error) {
      console.log("Gemini Error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again."
        }
      ]);

    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="chatbot-container">

      <div className="chatbot-header">

        <i className="fa-solid fa-robot"></i>

        <div>
          <h2>AI Movie Assistant</h2>
          <p>Ask me about movies and TV shows</p>
        </div>

      </div>


      <div className="chat-messages">

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "message user-message"
                : "message ai-message"
            }
          >

            <p>{message.text}</p>

          </div>
        ))}


        {loading && (
          <div className="message ai-message">
            <p>Typing...</p>
          </div>
        )}

        <div ref={messagesEndRef}></div>

      </div>


      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask about a movie or TV show..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>

      </div>

    </div>
  );
}

export default Chatbot;
