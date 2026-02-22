import React, { useState, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

import { useToast } from "../../contexts/toast"
import { LanguageSelector } from "../shared/LanguageSelector"
import { COMMAND_KEY } from "../../utils/platform"

interface QueueCommandsProps {
  onTooltipVisibilityChange: (visible: boolean, height: number) => void
  screenshotCount?: number
  problemText?: string
  credits: number
  currentLanguage: string
  setLanguage: (language: string) => void
}

const QueueCommands: React.FC<QueueCommandsProps> = ({
  onTooltipVisibilityChange,
  screenshotCount = 0,
  problemText = "",
  credits,
  currentLanguage,
  setLanguage
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [isClickThroughEnabled, setIsClickThroughEnabled] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  // Extract the repeated language selection logic into a separate function
  const extractLanguagesAndUpdate = (direction?: 'next' | 'prev') => {
    // Create a hidden instance of LanguageSelector to extract languages
    const hiddenRenderContainer = document.createElement('div');
    hiddenRenderContainer.style.position = 'absolute';
    hiddenRenderContainer.style.left = '-9999px';
    document.body.appendChild(hiddenRenderContainer);
    
    // Create a root and render the LanguageSelector temporarily
    const root = createRoot(hiddenRenderContainer);
    root.render(
      <LanguageSelector 
        currentLanguage={currentLanguage} 
        setLanguage={() => {}}
      />
    );
    
    // Use a small delay to ensure the component has rendered
    // 50ms is generally enough for React to complete a render cycle
    setTimeout(() => {
      // Extract options from the rendered select element
      const selectElement = hiddenRenderContainer.querySelector('select');
      if (selectElement) {
        const options = Array.from(selectElement.options);
        const values = options.map(opt => opt.value);
        
        // Find current language index
        const currentIndex = values.indexOf(currentLanguage);
        let newIndex = currentIndex;
        
        if (direction === 'prev') {
          // Go to previous language
          newIndex = (currentIndex - 1 + values.length) % values.length;
        } else {
          // Default to next language
          newIndex = (currentIndex + 1) % values.length;
        }
        
        if (newIndex !== currentIndex) {
          setLanguage(values[newIndex]);
          window.electronAPI.updateConfig({ language: values[newIndex] });
        }
      }
      
      // Clean up
      root.unmount();
      document.body.removeChild(hiddenRenderContainer);
    }, 50);
  };

  useEffect(() => {
    let tooltipHeight = 0
    if (tooltipRef.current && isTooltipVisible) {
      tooltipHeight = tooltipRef.current.offsetHeight + 10
    }
    onTooltipVisibilityChange(isTooltipVisible, tooltipHeight)
  }, [isTooltipVisible])

  // Check click-through status on window focus/blur
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused - click-through disabled')
      setIsClickThroughEnabled(false)
    }

    const handleBlur = () => {
      console.log('Window blurred - click-through enabled')
      setIsClickThroughEnabled(true)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [showToast])

  return (
    <div>
      <div className="pt-2 w-fit">
        <div className="text-xs text-white/90 backdrop-blur-md bg-black/60 rounded-lg py-2 px-4 flex items-center justify-center gap-4 draggable-area">
          {/* Click-Through Toggle */}
          <div
            className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-black/10 transition-colors"
            onClick={() => {
              // Toggle by blurring/focusing the window
              if (isClickThroughEnabled) {
                // Currently enabled, disable it by focusing
                window.focus()
                setIsClickThroughEnabled(false)
                showToast('Click-Through', 'Click-through disabled', 'success')
              } else {
                // Currently disabled, enable it by blurring
                window.blur()
                setIsClickThroughEnabled(true)
                showToast('Click-Through', 'Click-through enabled - click anywhere to disable', 'success')
              }
            }}
          >
            <span className="text-[11px] leading-none truncate">
              {isClickThroughEnabled ? "Disable Click-Through" : "Enable Click-Through"}
            </span>
            <div className="flex gap-1 flex-shrink-0">
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                {COMMAND_KEY}
              </span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                .
              </span>
            </div>
            <div className="flex gap-1">
              <span className={`w-2 h-2 rounded-full ${isClickThroughEnabled ? 'bg-green-500' : 'bg-gray-500'}`} />
            </div>
          </div>

          {/* Separator */}
          <div className="mx-2 h-4 w-px bg-black/20" />

          {/* Settings with Tooltip */}
          <div
            className="relative inline-block"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                try {
                  console.log('Settings gear icon clicked')
                  window.electronAPI.showSettings()
                } catch (error) {
                  console.error('Error opening settings:', error)
                  showToast('Error', 'Failed to open settings', 'error')
                }
              }}
              className="w-4 h-4 flex items-center justify-center cursor-pointer text-white/70 hover:text-white/90 transition-colors interactive bg-transparent border-0 p-0"
              aria-label="Settings"
              type="button"
              style={{ WebkitAppRegion: 'no-drag' } as any}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueueCommands
