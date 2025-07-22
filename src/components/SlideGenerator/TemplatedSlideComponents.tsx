import React from 'react'
import { TypedSlideData } from '../../types/slideStream.type'
import { PresentationTemplate, getTemplateStyles } from './templateConstants'

interface TemplatedSlideProps {
  slideData: TypedSlideData
  template: PresentationTemplate
  index: number
}

export const WelcomeSlide: React.FC<TemplatedSlideProps> = ({ slideData, template }) => {
  const templateStyles = getTemplateStyles(template)
  const welcomeData = slideData as Extract<TypedSlideData, { type: 'welcome' }>

  return (
    <section
      className='templated-welcome-slide'
      style={{
        background: `linear-gradient(135deg, ${templateStyles.colors.primary} 0%, ${templateStyles.colors.secondary} 100%)`,
        color: '#ffffff',
        textAlign: 'center',
        padding: templateStyles.spacing.padding,
        borderRadius: templateStyles.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className='slide-content'>
        <h1
          className='slide-title'
          style={{
            fontFamily: templateStyles.fonts.heading,
            fontSize: '2.5rem',
            marginBottom: '0.5em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1.2'
          }}
        >
          {welcomeData.title}
        </h1>
        <h2
          className='slide-subtitle'
          style={{
            fontFamily: templateStyles.fonts.body,
            fontSize: '1.4rem',
            fontWeight: '300',
            opacity: '0.9'
          }}
        >
          {welcomeData.data.subtitle}
        </h2>
      </div>
    </section>
  )
}

export const ContentSlide: React.FC<TemplatedSlideProps> = ({ slideData, template }) => {
  const templateStyles = getTemplateStyles(template)
  const contentData = slideData as Extract<TypedSlideData, { type: 'content' }>

  return (
    <section
      className='templated-content-slide'
      style={{
        backgroundColor: templateStyles.colors.background,
        color: templateStyles.colors.text,
        padding: templateStyles.spacing.padding,
        borderRadius: templateStyles.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className='slide-content' style={{ maxWidth: '90%', textAlign: 'center' }}>
        <h2
          className='slide-title'
          style={{
            fontFamily: templateStyles.fonts.heading,
            color: templateStyles.colors.primary,
            fontSize: '2rem',
            marginBottom: '0.8em',
            borderBottom: `3px solid ${templateStyles.colors.accent}`,
            paddingBottom: '0.3em',
            lineHeight: '1.2'
          }}
        >
          {contentData.title}
        </h2>
        <div
          className='slide-body'
          style={{
            fontFamily: templateStyles.fonts.body,
            fontSize: '1.1rem',
            lineHeight: '1.5',
            textAlign: 'left',
            color: templateStyles.colors.textSecondary,
            maxHeight: '70%',
            overflowY: 'auto'
          }}
        >
          <p style={{ marginBottom: '0.8em' }}>{contentData.data.body}</p>
        </div>
      </div>
    </section>
  )
}

export const ListSlide: React.FC<TemplatedSlideProps> = ({ slideData, template }) => {
  const templateStyles = getTemplateStyles(template)
  const listData = slideData as Extract<TypedSlideData, { type: 'list' }>

  return (
    <section
      className='templated-list-slide'
      style={{
        backgroundColor: templateStyles.colors.background,
        color: templateStyles.colors.text,
        padding: templateStyles.spacing.padding,
        borderRadius: templateStyles.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className='slide-content' style={{ maxWidth: '90%' }}>
        <h2
          className='slide-title'
          style={{
            fontFamily: templateStyles.fonts.heading,
            color: templateStyles.colors.primary,
            fontSize: '2rem',
            marginBottom: '0.8em',
            textAlign: 'center',
            borderBottom: `3px solid ${templateStyles.colors.accent}`,
            paddingBottom: '0.3em',
            lineHeight: '1.2'
          }}
        >
          {listData.title}
        </h2>
        <ul
          className='slide-list'
          style={{
            fontFamily: templateStyles.fonts.body,
            fontSize: '1.2rem',
            lineHeight: '1.6',
            color: templateStyles.colors.textSecondary,
            maxHeight: '70%',
            overflowY: 'auto',
            paddingLeft: '1.5em'
          }}
        >
          {listData.data.items.map((item, index) => (
            <li
              key={index}
              className='fragment'
              style={{
                marginBottom: '0.5em',
                position: 'relative'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '-1.2em',
                  color: templateStyles.colors.accent,
                  fontWeight: 'bold'
                }}
              >
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export const CompareSlide: React.FC<TemplatedSlideProps> = ({ slideData, template }) => {
  const templateStyles = getTemplateStyles(template)
  const compareData = slideData as Extract<TypedSlideData, { type: 'compare' }>

  return (
    <section
      className='templated-compare-slide'
      style={{
        backgroundColor: templateStyles.colors.background,
        color: templateStyles.colors.text,
        padding: templateStyles.spacing.padding,
        borderRadius: templateStyles.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className='slide-content' style={{ maxWidth: '95%' }}>
        <h2
          className='slide-title'
          style={{
            fontFamily: templateStyles.fonts.heading,
            color: templateStyles.colors.primary,
            fontSize: '2rem',
            marginBottom: '0.8em',
            textAlign: 'center',
            borderBottom: `3px solid ${templateStyles.colors.accent}`,
            paddingBottom: '0.3em',
            lineHeight: '1.2'
          }}
        >
          {compareData.title}
        </h2>
        <div
          className='comparison-container'
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2em',
            alignItems: 'start',
            maxHeight: '70%',
            overflow: 'hidden'
          }}
        >
          <div
            className='comparison-left'
            style={{
              backgroundColor: `${templateStyles.colors.primary}10`,
              padding: '1.5em',
              borderRadius: templateStyles.borderRadius,
              border: `2px solid ${templateStyles.colors.primary}`,
              height: '100%'
            }}
          >
            <h3
              style={{
                fontFamily: templateStyles.fonts.heading,
                color: templateStyles.colors.primary,
                fontSize: '1.3rem',
                marginBottom: '0.8em',
                textAlign: 'center'
              }}
            >
              {compareData.data.left_header}
            </h3>
            <ul
              style={{
                fontFamily: templateStyles.fonts.body,
                fontSize: '1rem',
                lineHeight: '1.4',
                color: templateStyles.colors.textSecondary,
                listStyleType: 'none',
                padding: 0
              }}
            >
              {compareData.data.left_points.map((point, index) => (
                <li key={index} className='fragment' style={{ marginBottom: '0.5em' }}>
                  <span style={{ color: templateStyles.colors.primary, marginRight: '0.5em' }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div
            className='comparison-divider'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '200px'
            }}
          >
            <span
              style={{
                fontFamily: templateStyles.fonts.heading,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: templateStyles.colors.accent,
                backgroundColor: templateStyles.colors.background,
                padding: '0.5em',
                borderRadius: '50%',
                border: `3px solid ${templateStyles.colors.accent}`,
                minWidth: '60px',
                textAlign: 'center'
              }}
            >
              VS
            </span>
          </div>

          <div
            className='comparison-right'
            style={{
              backgroundColor: `${templateStyles.colors.secondary}10`,
              padding: '1.5em',
              borderRadius: templateStyles.borderRadius,
              border: `2px solid ${templateStyles.colors.secondary}`,
              height: '100%'
            }}
          >
            <h3
              style={{
                fontFamily: templateStyles.fonts.heading,
                color: templateStyles.colors.secondary,
                fontSize: '1.3rem',
                marginBottom: '0.8em',
                textAlign: 'center'
              }}
            >
              {compareData.data.right_header}
            </h3>
            <ul
              style={{
                fontFamily: templateStyles.fonts.body,
                fontSize: '1rem',
                lineHeight: '1.4',
                color: templateStyles.colors.textSecondary,
                listStyleType: 'none',
                padding: 0
              }}
            >
              {compareData.data.right_points.map((point, index) => (
                <li key={index} className='fragment' style={{ marginBottom: '0.5em' }}>
                  <span style={{ color: templateStyles.colors.secondary, marginRight: '0.5em' }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export const ThanksSlide: React.FC<TemplatedSlideProps> = ({ slideData, template }) => {
  const templateStyles = getTemplateStyles(template)
  const thanksData = slideData as Extract<TypedSlideData, { type: 'thanks' }>

  return (
    <section
      className='templated-thanks-slide'
      style={{
        background: `linear-gradient(135deg, ${templateStyles.colors.accent} 0%, ${templateStyles.colors.primary} 100%)`,
        color: '#ffffff',
        textAlign: 'center',
        padding: templateStyles.spacing.padding,
        borderRadius: templateStyles.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className='slide-content'>
        <h1
          className='slide-title'
          style={{
            fontFamily: templateStyles.fonts.heading,
            fontSize: '2.5rem',
            marginBottom: '0.5em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: '1.2'
          }}
        >
          {thanksData.title}
        </h1>
        <h2
          className='slide-message'
          style={{
            fontFamily: templateStyles.fonts.body,
            fontSize: '1.4rem',
            fontWeight: '300',
            opacity: '0.9'
          }}
        >
          {thanksData.data.message}
        </h2>
      </div>
    </section>
  )
}
