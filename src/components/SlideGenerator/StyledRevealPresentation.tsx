import React, { useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import { TypedSlideData } from '../../types/slideStream.type'
import { PresentationTemplate, getTemplateStyles } from './templateConstants'
import { WelcomeSlide, ContentSlide, ListSlide, CompareSlide, ThanksSlide } from './TemplatedSlideComponents'
import './StyledRevealPresentation.css'

interface StyledRevealPresentationProps {
  slides: TypedSlideData[]
  template: PresentationTemplate
  autoProgress?: boolean
  progressInterval?: number
  height?: string | number
  size?: 'small' | 'medium' | 'large'
}

const StyledRevealPresentation: React.FC<StyledRevealPresentationProps> = ({
  slides,
  template,
  autoProgress = false,
  progressInterval = 5000,
  height = '100%',
  size = 'medium'
}) => {
  const deckRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<Reveal.Api | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const templateStyles = getTemplateStyles(template)

  useEffect(() => {
    if (!deckRef.current || !containerRef.current) return

    // Clean up any existing instance
    if (revealRef.current) {
      revealRef.current.destroy()
      revealRef.current = null
    }

    // Set container size attribute for CSS targeting
    containerRef.current.setAttribute('data-size', size)

    // Initialize Reveal.js with template-specific settings
    revealRef.current = new Reveal(deckRef.current, {
      hash: false,
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
      embedded: true,
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
  }, [autoProgress, progressInterval, size, slides.length, template.id])

  // Re-sync when slides or template change
  useEffect(() => {
    if (revealRef.current) {
      setTimeout(() => {
        revealRef.current?.sync()
        revealRef.current?.slide(0, 0)
      }, 100)
    }
  }, [slides, template])

  const renderSlide = (slideData: TypedSlideData, index: number) => {
    const slideProps = { slideData, template, index }

    switch (slideData.type) {
      case 'welcome':
        return <WelcomeSlide key={index} {...slideProps} />
      case 'content':
        return <ContentSlide key={index} {...slideProps} />
      case 'list':
        return <ListSlide key={index} {...slideProps} />
      case 'compare':
        return <CompareSlide key={index} {...slideProps} />
      case 'thanks':
        return <ThanksSlide key={index} {...slideProps} />
      default:
        return <ContentSlide key={index} {...slideProps} />
    }
  }

  return (
    <div
      ref={containerRef}
      className='styled-reveal-container'
      style={
        {
          height: typeof height === 'number' ? `${height}px` : height,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: templateStyles.colors.background,
          fontFamily: templateStyles.fonts.body,
          borderRadius: templateStyles.borderRadius,
          boxShadow: templateStyles.boxShadow,
          // CSS variables for template styling
          '--template-primary': templateStyles.colors.primary,
          '--template-secondary': templateStyles.colors.secondary,
          '--template-accent': templateStyles.colors.accent,
          '--template-background': templateStyles.colors.background,
          '--template-text': templateStyles.colors.text,
          '--template-text-secondary': templateStyles.colors.textSecondary,
          '--template-heading-font': templateStyles.fonts.heading,
          '--template-body-font': templateStyles.fonts.body,
          '--template-code-font': templateStyles.fonts.code,
          '--template-border-radius': templateStyles.borderRadius,
          '--template-spacing': templateStyles.spacing.padding,
          '--template-margin': templateStyles.spacing.margin
        } as React.CSSProperties
      }
    >
      <div
        className='reveal'
        ref={deckRef}
        style={{
          backgroundColor: templateStyles.colors.background,
          color: templateStyles.colors.text,
          fontFamily: templateStyles.fonts.body
        }}
      >
        <div
          className='slides'
          style={{
            backgroundColor: templateStyles.colors.background
          }}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </div>
      </div>
    </div>
  )
}

export default StyledRevealPresentation
