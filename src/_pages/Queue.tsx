import React, { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ScreenshotQueue from "../components/Queue/ScreenshotQueue"
import QueueCommands from "../components/Queue/QueueCommands"
import { useToast } from "../contexts/toast"
import { Screenshot } from "../types/screenshots"
import { COMMAND_KEY } from "../utils/platform"

async function fetchScreenshots(): Promise<Screenshot[]> {
  try {
    const existing = await window.electronAPI.getScreenshots()
    return existing
  } catch (error) {
    console.error("Error loading screenshots:", error)
    throw error
  }
}

interface QueueProps {
  setView: (view: "queue" | "solutions" | "debug") => void
  credits: number
  currentLanguage: string
  setLanguage: (language: string) => void
}

const Queue: React.FC<QueueProps> = ({
  setView,
  credits,
  currentLanguage,
  setLanguage
}) => {
  const { showToast } = useToast()

  const contentRef = useRef<HTMLDivElement>(null)
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string; images?: string[] }[]
  >([])
  const [chatLoading, setChatLoading] = useState(false)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const [problemText, setProblemText] = useState("")

  const {
    data: screenshots = [],
    isLoading,
    refetch
  } = useQuery<Screenshot[]>({
    queryKey: ["screenshots"],
    queryFn: fetchScreenshots,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [chatInput])

  const handleDeleteScreenshot = async (index: number) => {
    const screenshotToDelete = screenshots[index]

    try {
      const response = await window.electronAPI.deleteScreenshot(
        screenshotToDelete.path
      )

      if (response.success) {
        refetch()
      } else {
        console.error("Failed to delete screenshot:", response.error)
        showToast("Error", "Failed to delete the screenshot file", "error")
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error)
    }
  }

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  useEffect(() => {
    // Set up event listeners
    const cleanupFunctions = [
      window.electronAPI.onScreenshotTaken(() => refetch()),
      window.electronAPI.onResetView(() => {
        refetch()
        setChatMessages([])
        setChatInput("")
      }),
      window.electronAPI.onDeleteLastScreenshot(async () => {
        if (screenshots.length > 0) {
          await handleDeleteScreenshot(screenshots.length - 1)
        } else {
          showToast("No Screenshots", "There are no screenshots to delete", "neutral")
        }
      }),
      window.electronAPI.onSolutionError((error: string) => {
        showToast(
          "Processing Failed",
          "There was an error processing your request.",
          "error"
        )
        console.error("Processing error:", error)
      }),
      window.electronAPI.onProcessingNoScreenshots(() => {
        showToast(
          "No Screenshots",
          "There are no screenshots to process.",
          "neutral"
        )
      }),
      window.electronAPI.onClickThroughToggled((enabled: boolean) => {
        // When click-through is disabled, focus the textarea
        if (!enabled) {
          setTimeout(() => {
            textareaRef.current?.focus()
          }, 100)
        }
      }),
    ]

    // Focus textarea when window gains focus
    const handleWindowFocus = () => {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }

    window.addEventListener('focus', handleWindowFocus)

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [screenshots])

  const handleChatSend = async () => {
    if ((!chatInput.trim() && screenshots.length === 0) || chatLoading) return

    const messageToSend = chatInput.trim()
    const attachedImages = screenshots.map(s => s.preview)
    
    // Add user message to chat
    setChatMessages((msgs) => [
      ...msgs,
      {
        role: "user",
        text: messageToSend || "(Attached images)",
        images: attachedImages.length > 0 ? attachedImages : undefined
      }
    ])
    
    setChatLoading(true)
    setChatInput("")

    try {
      // Build conversation history for context
      const conversationHistory = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.text
      }))

      // Add current message
      conversationHistory.push({
        role: "user",
        content: messageToSend
      })

      // Send message with full context
      const response = await window.electronAPI.chatMessageWithContext({
        message: messageToSend,
        history: conversationHistory,
        screenshots: screenshots.map(s => s.path)
      })

      if (response.success) {
        setChatMessages((msgs) => [
          ...msgs,
          { role: "assistant", text: response.text || "" }
        ])
        
        // Clear screenshots after successful send
        for (const screenshot of screenshots) {
          await window.electronAPI.deleteScreenshot(screenshot.path)
        }
        refetch()
      } else {
        setChatMessages((msgs) => [
          ...msgs,
          { role: "assistant", text: "Error: " + (response.error || "Unknown error") }
        ])
      }
    } catch (err) {
      setChatMessages((msgs) => [
        ...msgs,
        { role: "assistant", text: "Error: " + String(err) }
      ])
    } finally {
      setChatLoading(false)
      textareaRef.current?.focus()
    }
  }
  
  return (
    <div ref={contentRef} className="bg-transparent w-full min-w-[800px] max-w-[1200px] h-screen flex flex-col">
      {/* Top Controls - Draggable Area */}
      <div className="shrink-0 py-3">
        <div className="space-y-3">
          <QueueCommands
            onTooltipVisibilityChange={handleTooltipVisibilityChange}
            screenshotCount={screenshots.length}
            problemText={problemText}
            credits={credits}
            currentLanguage={currentLanguage}
            setLanguage={setLanguage}
          />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 rounded-md mb-3 bg-black/60 overflow-y-auto px-4 py-4 space-y-4 interactive">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-white text-xl font-semibold mb-2">Start a Conversation</h2>
              <p className="text-white/60 text-sm max-w-md">
                Ask questions, get coding help, or attach screenshots for analysis.
                <br />
                Your conversation history is maintained for context.
              </p>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600/90 text-white"
                      : "bg-black/60 backdrop-blur-md text-white border border-white/10"
                  }`}
                >
                  {msg.images && msg.images.length > 0 && (
                    <div className="mb-2 flex gap-2 flex-wrap">
                      {msg.images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img}
                          alt={`Attachment ${imgIdx + 1}`}
                          className="max-w-[200px] max-h-[150px] rounded-lg border border-white/20"
                        />
                      ))}
                    </div>
                  )}
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({ node, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '')
                            const inline = !match
                            return !inline ? (
                              <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto border border-white/10">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            )
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-black/60 backdrop-blur-md text-white/70 px-4 py-3 rounded-2xl border border-white/10">
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse animation-delay-200">●</span>
                    <span className="animate-pulse animation-delay-400">●</span>
                    <span className="ml-2">Thinking...</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-black/60 rounded-md backdrop-blur-md border-t border-white/10 px-4 py-4 shrink-0 interactive">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleChatSend()
          }}
          className="flex gap-3 items-end"
        >
          <div className="flex-1">
            {screenshots.length > 0 && (
              <div className="mb-3 p-3 bg-black/40 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/70">
                    {screenshots.length} image{screenshots.length > 1 ? 's' : ''} attached
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      // Clear all screenshots
                      for (const screenshot of screenshots) {
                        await window.electronAPI.deleteScreenshot(screenshot.path)
                      }
                      refetch()
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors interactive"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {screenshots.map((screenshot, index) => (
                    <div key={screenshot.path} className="relative group">
                      <img
                        src={screenshot.preview}
                        alt={`Screenshot ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteScreenshot(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity interactive"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <div className="text-white mt-3 flex items-center gap-1">
                    <span className="text-[12px]">Remove last screenshot</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        {COMMAND_KEY}
                      </span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        L
                      </span>
                    </div>
                  </div>
                  <div className="text-white mt-3 flex items-center gap-1">
                    <span className="text-[12px]">Remove all screenshots</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        {COMMAND_KEY}
                      </span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        R
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                className="w-full rounded-lg px-4 py-3 bg-black/40 backdrop-blur-md text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 resize-y min-h-[52px] max-h-[200px] interactive"
                placeholder="Type your message or attach images... (Ctrl+H to screenshot, Enter to send)"
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value)
                  // Mirror into a global variable so the main process can read it
                  if (typeof window !== "undefined") {
                    ;(window as any).__PROBLEM_TEXT__ = e.target.value
                  }
                }}
                onKeyDown={(e) => {
                  // Enter (sem Shift) ou Ctrl+Enter envia a mensagem
                  // Só envia se houver texto OU imagens anexadas
                  const hasContent = chatInput.trim() || screenshots.length > 0

                  if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && hasContent) {
                    e.preventDefault()
                    handleChatSend()
                  } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && hasContent) {
                    e.preventDefault()
                    handleChatSend()
                  }
                }}
                disabled={chatLoading}
                rows={1}
              />
              <div>
                <button
                  type="submit"
                  className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:cursor-not-allowed transition-all duration-200 shrink-0 interactive"
                  disabled={chatLoading || (!chatInput.trim() && screenshots.length === 0)}
                  aria-label="Send"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-7.5-15-7.5v6l10 1.5-10 1.5v6z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Queue
