// src/components/RevealSlides/SlideComponents.tsx
import React from 'react'
import { TypedSlideData } from '../../types/slideStream.type'

interface SlideProps {
  slideData: TypedSlideData
  slideNumber: number
}

export const WelcomeSlide: React.FC<{ slideData: Extract<TypedSlideData, { type: 'welcome' }> }> = ({ slideData }) => (
  <section className='welcome-slide'>
    <div className='slide-content'>
      <h1 className='slide-title'>{slideData.title}</h1>
      <h2 className='slide-subtitle'>{slideData.data.subtitle}</h2>
    </div>
    <div className='narration' style={{ display: 'none' }}>
      {slideData.narrationScript}
    </div>
  </section>
)

export const ContentSlide: React.FC<{ slideData: Extract<TypedSlideData, { type: 'content' }> }> = ({ slideData }) => (
  <section className='content-slide'>
    <div className='slide-content'>
      <h2 className='slide-title'>{slideData.title}</h2>
      <div className='slide-body'>
        <p>{slideData.data.body}</p>
      </div>
    </div>
    <div className='narration' style={{ display: 'none' }}>
      {slideData.narrationScript}
    </div>
  </section>
)

export const ListSlide: React.FC<{ slideData: Extract<TypedSlideData, { type: 'list' }> }> = ({ slideData }) => (
  <section className='list-slide'>
    <div className='slide-content'>
      <h2 className='slide-title'>{slideData.title}</h2>
      <ul className='slide-list'>
        {slideData.data.items.map((item, index) => (
          <li key={index} className='fragment'>
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className='narration' style={{ display: 'none' }}>
      {slideData.narrationScript}
    </div>
  </section>
)

export const CompareSlide: React.FC<{ slideData: Extract<TypedSlideData, { type: 'compare' }> }> = ({ slideData }) => (
  <section className='compare-slide'>
    <div className='slide-content'>
      <h2 className='slide-title'>{slideData.title}</h2>
      <div className='comparison-container'>
        <div className='comparison-left'>
          <h3>{slideData.data.left_header}</h3>
          <ul>
            {slideData.data.left_points.map((point, index) => (
              <li key={index} className='fragment'>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className='comparison-divider'>
          <span>VS</span>
        </div>
        <div className='comparison-right'>
          <h3>{slideData.data.right_header}</h3>
          <ul>
            {slideData.data.right_points.map((point, index) => (
              <li key={index} className='fragment'>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <div className='narration' style={{ display: 'none' }}>
      {slideData.narrationScript}
    </div>
  </section>
)

export const ThanksSlide: React.FC<{ slideData: Extract<TypedSlideData, { type: 'thanks' }> }> = ({ slideData }) => (
  <section className='thanks-slide'>
    <div className='slide-content'>
      <h1 className='slide-title'>{slideData.title}</h1>
      <h2 className='slide-message'>{slideData.data.message}</h2>
    </div>
    <div className='narration' style={{ display: 'none' }}>
      {slideData.narrationScript}
    </div>
  </section>
)
