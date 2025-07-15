// src/components/RevealSlides/RevealPresentation.tsx
import React, { useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import { TypedSlideData } from '../../types/slideStream.type'
import { WelcomeSlide, ContentSlide, ListSlide, CompareSlide, ThanksSlide } from './SlideComponents'
import './RevealSlides.css'

interface RevealPresentationProps {
  slides: TypedSlideData[]
  autoProgress?: boolean
  progressInterval?: number
  height?: string | number
  size?: 'small' | 'medium' | 'large'
}

const RevealPresentation: React.FC<RevealPresentationProps> = ({
  slides,
  autoProgress = false,
  progressInterval = 5000,
  height = '100%',
  size = 'medium'
}) => {
  const deckRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<Reveal.Api | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!deckRef.current || !containerRef.current) return

    // Clean up any existing instance
    if (revealRef.current) {
      revealRef.current.destroy()
      revealRef.current = null
    }

    // Set container size attribute for CSS targeting
    containerRef.current.setAttribute('data-size', size)

    // Initialize Reveal.js with container-specific settings
    revealRef.current = new Reveal(deckRef.current, {
      hash: false, // Disable hash to avoid conflicts
      controls: true,
      progress: true,
      center: true,
      transition: 'slide',
      autoSlide: autoProgress ? progressInterval : 0,
      autoSlideStoppable: true,
      keyboard: true,
      touch: true,
      loop: false,
      rtl: false,
      embedded: true, // Important: embedded mode
      help: true,
      showNotes: false,
      autoPlayMedia: false,
      width: '100%',
      height: '100%',
      margin: 0.05,
      minScale: 0.2,
      maxScale: 2.0,
      backgroundTransition: 'fade'
    })

    // Initialize and sync
    revealRef.current.initialize().then(() => {
      if (revealRef.current) {
        revealRef.current.sync()
      }
    })

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy()
        revealRef.current = null
      }
    }
  }, [autoProgress, progressInterval, size, slides.length])

  // Re-sync when slides change
  useEffect(() => {
    if (revealRef.current) {
      setTimeout(() => {
        revealRef.current?.sync()
        revealRef.current?.slide(0, 0) // Go to first slide
      }, 100)
    }
  }, [slides])

  const renderSlide = (slideData: TypedSlideData, index: number) => {
    switch (slideData.type) {
      case 'welcome':
        return <WelcomeSlide key={index} slideData={slideData} />
      case 'content':
        return <ContentSlide key={index} slideData={slideData} />
      case 'list':
        return <ListSlide key={index} slideData={slideData} />
      case 'compare':
        return <CompareSlide key={index} slideData={slideData} />
      case 'thanks':
        return <ThanksSlide key={index} slideData={slideData} />
      default:
        return <ContentSlide key={index} slideData={slideData as Extract<TypedSlideData, { type: 'content' }>} />
    }
  }

  return (
    <div
      ref={containerRef}
      className='reveal-container'
      style={
        {
          height: typeof height === 'number' ? `${height}px` : height,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          // Override Reveal.js CSS variables locally
          '--r-background-color': '#ffffff',
          '--r-main-color': '#000000',
          '--r-heading-color': '#000000'
        } as React.CSSProperties
      }
    >
      <div
        className='reveal'
        ref={deckRef}
        style={{
          backgroundColor: '#ffffff'
        }}
      >
        <div
          className='slides'
          style={{
            backgroundColor: '#ffffff'
          }}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </div>
      </div>
    </div>
  )
}

export default RevealPresentation
