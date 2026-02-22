import { useEffect, useState, useRef } from 'react'
import './index.css'

function App() {

  const [messages, setMessages] = useState(["hi there", "hello", "how are u"])
  const [input, setInput] = useState("")
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(m => [...m, data.message])
    }



    // return () => {
    //   ws.close()
    // }
    wsRef.current = ws


    ws.onopen = () => {

      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return

    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: {
        roomId: "red",   // 👈 ADD THIS
        message: input
      }
    }))

    setInput("")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      {/* Chat Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl 
                      h-[80vh] 
                      bg-neutral-900 
                      rounded-2xl 
                      shadow-2xl 
                      flex flex-col 
                      border border-neutral-800">

        {/* Header */}
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-neutral-200 text-lg font-semibold text-center">
            Chat Room
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-neutral-800 text-neutral-200 
                         px-4 py-2 rounded-xl 
                         w-fit max-w-[75%]"
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-800 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-neutral-800 text-neutral-200 
                       px-4 py-2 rounded-lg 
                       outline-none 
                       focus:ring-1 focus:ring-neutral-600 
                       placeholder:text-neutral-500"
          />
          <button
            onClick={sendMessage}
            className="bg-neutral-700 hover:bg-neutral-600 
                       text-neutral-200 
                       px-5 py-2 rounded-lg 
                       transition duration-200"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  )
}

export default App