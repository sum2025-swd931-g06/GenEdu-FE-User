import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css' // Using white theme for better integration with the UI
import { Slide } from '../../types/auth.type'

// Custom responsive styles for reveal.js
const customStyles = `
  .reveal .slides section {
    font-size: 1rem !important;
    line-height: 1.4 !important;
    padding: 15px !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    /* Smooth transitions */
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out !important;
  }
  
  /* Prevent flash during transitions */
  .reveal .slides section.past,
  .reveal .slides section.future {
    opacity: 0 !important;
  }
  
  .reveal .slides section.present {
    opacity: 1 !important;
  }
  
  .reveal .slides section h1,
  .reveal .slides section h2,
  .reveal .slides section h3,
  .reveal .slides section h4,
  .reveal .slides section h5,
  .reveal .slides section h6 {
    font-size: clamp(1rem, 3.5vw, 1.8rem) !important;
    line-height: 1.2 !important;
    margin: 0 0 0.5em 0 !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    max-height: 30% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    /* Prevent font shifting during transitions */
    font-display: swap !important;
    will-change: transform !important;
  }
  
  .reveal .slides section p,
  .reveal .slides section li,
  .reveal .slides section div {
    font-size: clamp(0.7rem, 2vw, 1rem) !important;
    line-height: 1.4 !important;
    margin: 0.3em 0 !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    /* Prevent font shifting during transitions */
    font-display: swap !important;
    will-change: transform !important;
  }
  
  .reveal .slides section ul,
  .reveal .slides section ol {
    max-width: 90% !important;
    margin: 0 auto !important;
    padding-left: 1em !important;
    max-height: 70% !important;
    overflow-y: auto !important;
  }
  
  .reveal .slides section img {
    max-width: 100% !important;
    max-height: 50% !important;
    object-fit: contain !important;
    /* Prevent image flash */
    image-rendering: optimizeQuality !important;
    will-change: transform !important;
  }
  
  .reveal .slides {
    width: 100% !important;
    height: 100% !important;
    /* Smooth slide container transitions */
    transform-style: preserve-3d !important;
  }
  
  .reveal .slides > section {
    width: 100% !important;
    height: 100% !important;
    padding: 10px !important;
    /* Hardware acceleration for smoother transitions */
    transform: translateZ(0) !important;
    backface-visibility: hidden !important;
  }
  
  /* Hide reveal.js default controls when embedded */
  .reveal.embedded .controls {
    display: none !important;
  }
  
  .reveal.embedded .progress {
    display: none !important;
  }
  
  /* Responsive adjustments for smaller containers */
  @media (max-width: 768px) {
    .reveal .slides section {
      padding: 10px !important;
    }
    
    .reveal .slides section h1,
    .reveal .slides section h2,
    .reveal .slides section h3,
    .reveal .slides section h4,
    .reveal .slides section h5,
    .reveal .slides section h6 {
      font-size: clamp(0.9rem, 4vw, 1.5rem) !important;
    }
    
    .reveal .slides section p,
    .reveal .slides section li,
    .reveal .slides section div {
      font-size: clamp(0.6rem, 3vw, 0.9rem) !important;
    }
  }
  
  /* Additional responsive adjustments for very small containers */
  @media (max-height: 400px) {
    .reveal .slides section {
      padding: 5px !important;
    }
    
    .reveal .slides section h1,
    .reveal .slides section h2,
    .reveal .slides section h3,
    .reveal .slides section h4,
    .reveal .slides section h5,
    .reveal .slides section h6 {
      font-size: clamp(0.8rem, 3vw, 1.2rem) !important;
      margin: 0 0 0.3em 0 !important;
    }
    
    .reveal .slides section p,
    .reveal .slides section li,
    .reveal .slides section div {
      font-size: clamp(0.6rem, 2.5vw, 0.8rem) !important;
      margin: 0.2em 0 !important;
    }
  }
  
  /* Additional optimizations to prevent flash */
  .reveal .slides section * {
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
  }
  
  /* Font loading optimization */
  @font-face {
    font-display: swap;
  }
  
  /* Ensure smooth transitions for all elements */
  .reveal .slides section > * {
    transition: opacity 0.15s ease-out !important;
  }
  
  /* Prevent any potential flicker from list styles */
  .reveal .slides section ul li,
  .reveal .slides section ol li {
    transition: none !important;
  }
`

interface RevealSlideViewerProps {
  slides: Slide[]
  currentSlideIndex?: number
  onSlideChange?: (slideIndex: number) => void
  height?: string
  embedded?: boolean
  showControls?: boolean
}

export interface RevealSlideViewerRef {
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
  getCurrentSlide: () => number
  destroy: () => void
}

const RevealSlideViewer = forwardRef<RevealSlideViewerRef, RevealSlideViewerProps>(
  ({ slides, currentSlideIndex = 0, onSlideChange, height = '500px', embedded = true, showControls = true }, ref) => {
    const revealRef = useRef<HTMLDivElement>(null)
    const revealInstance = useRef<Reveal.Api | null>(null)

    useImperativeHandle(ref, () => ({
      goToSlide: (index: number) => {
        if (revealInstance.current) {
          revealInstance.current.slide(index)
        }
      },
      nextSlide: () => {
        if (revealInstance.current) {
          revealInstance.current.next()
        }
      },
      prevSlide: () => {
        if (revealInstance.current) {
          revealInstance.current.prev()
        }
      },
      getCurrentSlide: () => {
        return revealInstance.current?.getIndices()?.h || 0
      },
      destroy: () => {
        if (revealInstance.current) {
          revealInstance.current.destroy()
          revealInstance.current = null
        }
      }
    }))

  const initReveal = useCallback(() => {
    if (!revealRef.current || slides.length === 0) return

    // Destroy existing instance
    if (revealInstance.current) {
      revealInstance.current.destroy()
      revealInstance.current = null
    }

    // Inject custom styles
    const styleId = 'reveal-custom-styles'
    let styleElement = document.getElementById(styleId)
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.textContent = customStyles
      document.head.appendChild(styleElement)
    }

    const deck = new Reveal(revealRef.current, {
      embedded,
      hash: false,
      transition: 'fade',
      transitionSpeed: 'fast',
      backgroundTransition: 'none',
      controls: showControls,
      progress: showControls,
      center: true,
      touch: true,
      loop: false,
      rtl: false,
      shuffle: false,
      fragments: false,
      autoSlide: 0,
      keyboard: embedded ? false : true,
      mouseWheel: false,
      hideInactiveCursor: true,
      hideCursorTime: 5000,
      previewLinks: false,
      width: '100%',
      height: '100%',
      margin: 0.1,
      minScale: 0.2,
      maxScale: 1.0,
      viewDistance: 1
    })

    deck
      .initialize()
      .then(() => {
        revealInstance.current = deck

        // Simple slide change handler
        const handleSlideChanged = () => {
          const indices = deck.getIndices()
          const slideIndex = indices?.h || 0
          onSlideChange?.(slideIndex)
        }

        // Listen for slide changes
        deck.on('slidechanged', handleSlideChanged)
      })
      .catch((error) => {
        console.error('Failed to initialize Reveal.js:', error)
      })
  }, [slides.length, embedded, showControls, onSlideChange])

    // Initialize reveal when slides change
    useEffect(() => {
      if (slides.length > 0) {
        initReveal()
      }
    }, [initReveal, slides.length])

    // Handle initial slide index after initialization
    useEffect(() => {
      if (revealInstance.current && currentSlideIndex > 0) {
        // Small delay to ensure reveal.js is fully ready
        const timer = setTimeout(() => {
          if (revealInstance.current) {
            revealInstance.current.slide(currentSlideIndex)
          }
        }, 150)
        return () => clearTimeout(timer)
      }
    }, [currentSlideIndex, slides.length]) // Also depend on slides.length to trigger after initialization

    // Handle external slide index changes
    useEffect(() => {
      if (revealInstance.current && typeof currentSlideIndex === 'number') {
        const currentIndex = revealInstance.current.getIndices()?.h || 0
        if (currentIndex !== currentSlideIndex) {
          revealInstance.current.slide(currentSlideIndex)
        }
      }
    }, [currentSlideIndex])

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (revealInstance.current) {
          revealInstance.current.destroy()
          revealInstance.current = null
        }
      }
    }, [])

    const renderSlideContent = (slide: Slide) => {
      // Parse slide content and render as reveal.js section with responsive sizing
      return (
        <section key={slide.id} data-slide-id={slide.id}>
          <div style={{ 
            textAlign: 'center',
            padding: '10px',
            maxHeight: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            // Hardware acceleration to prevent flash
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            // Prevent layout shifts
            willChange: 'transform',
            contain: 'layout style paint'
          }}>
            {slide.title && (
              <h2 style={{ 
                marginBottom: '0.5em', 
                color: '#333',
                fontSize: 'clamp(1rem, 3.5vw, 1.8rem)', // More conservative responsive font size
                fontWeight: '600',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: '25%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Prevent layout shifts
                contain: 'layout style'
              }}>
                {slide.title}
              </h2>
            )}
            <div
              style={{
                fontSize: 'clamp(0.7rem, 2vw, 1rem)', // More conservative responsive font size
                lineHeight: '1.3',
                color: '#555',
                maxWidth: '95%',
                margin: '0 auto',
                overflow: 'auto',
                maxHeight: slide.title ? '75%' : '100%', // Account for title
                padding: '0 5px',
                width: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                // Prevent layout shifts
                contain: 'layout style',
                // Smooth scrolling if content overflows
                scrollBehavior: 'smooth'
              }}
              dangerouslySetInnerHTML={{ __html: slide.content }}
            />
          </div>
        </section>
      )
    }

    if (slides.length === 0) {
      return (
        <div
          style={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            backgroundColor: '#fafafa'
          }}
        >
          <p style={{ color: '#999', fontSize: '16px' }}>No slides to display</p>
        </div>
      )
    }

    return (
      <div
        style={{
          height,
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}
      >
        <div className={`reveal ${embedded ? 'embedded' : ''}`} ref={revealRef} style={{ height: '100%' }}>
          <div className='slides'>{slides.map(renderSlideContent)}</div>
        </div>
      </div>
    )
  }
)

RevealSlideViewer.displayName = 'RevealSlideViewer'

export default RevealSlideViewer
