'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [instruction, setInstruction] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])

  // Check WordPress connection on mount
  useEffect(() => {
    checkConnection()
    loadProjects()
  }, [])

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/wordpress/status')
      const data = await res.json()
      setConnectionStatus(data.connected ? 'connected' : 'disconnected')
    } catch (error) {
      setConnectionStatus('disconnected')
    }
  }

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!instruction.trim()) return

    const userMessage = { role: 'user', content: instruction }
    setMessages(prev => [...prev, userMessage])
    setInstruction('')

    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'default',
          instruction: userMessage.content
        })
      })
      
      const data = await res.json()
      const aiMessage = { 
        role: 'assistant', 
        content: `Task started: ${data.task_id}. Status: ${data.status}` 
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'Error: Failed to process request' 
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NEX WoodMart Platform</h1>
        <p className="text-gray-600">AI-powered WordPress management</p>
        
        <div className="mt-4 flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            WordPress: {connectionStatus || 'checking...'}
          </span>
          <span className="text-sm text-gray-500">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Chat Assistant</h2>
          
          <div className="h-96 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-20">
                Start by typing an instruction, e.g., "Change logo position to center"
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`mb-4 p-3 rounded ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 ml-8' 
                      : 'bg-gray-200 mr-8'
                  }`}
                >
                  <strong className="block text-sm mb-1">
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </strong>
                  {msg.content}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your instruction..."
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>

        {/* Projects Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project: any) => (
                <li 
                  key={project.id}
                  className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.wordpress_url}</p>
                </li>
              ))}
            </ul>
          )}

          <button className="mt-4 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-blue-500 hover:text-blue-600">
            + New Project
          </button>
        </div>
      </main>
    </div>
  )
}
