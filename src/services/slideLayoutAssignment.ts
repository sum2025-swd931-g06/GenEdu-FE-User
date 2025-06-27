import type { SlideLayout, LayoutRegion } from '../types/layout.type'
import type { Theme } from '../types/theme.type'
import type { GeneratedSlide, SlideContent, SlideGenerationParams } from '../types/slide.type'
import { predefinedLayouts, getLayoutById } from '../layouts/predefinedLayouts'
import { predefinedThemes } from '../themes/predefinedThemes'

export interface LayoutAssignmentRules {
  slideTypeToLayout: Record<string, string>
  contentTypeToLayout: Record<string, string>
  fallbackLayoutId: string
}

export class SlideLayoutAssignmentService {
  private static readonly DEFAULT_RULES: LayoutAssignmentRules = {
    slideTypeToLayout: {
      title: 'title-slide',
      introduction: 'title-slide',
      overview: 'content-image',
      content: 'content-image',
      'bullet-points': 'bullet-list',
      list: 'bullet-list',
      comparison: 'two-column',
      conclusion: 'content-image',
      summary: 'bullet-list',
      quote: 'quote',
      image: 'full-image',
      code: 'content-image',
      chart: 'content-image',
      diagram: 'content-image'
    },
    contentTypeToLayout: {
      title: 'title-slide',
      list: 'bullet-list',
      quote: 'quote',
      image: 'full-image',
      comparison: 'two-column',
      text: 'content-image'
    },
    fallbackLayoutId: 'content-image'
  }

  private static readonly DEFAULT_THEME_ID = 'business-professional'

  /**
   * Assigns a layout to a slide based on slide type and content analysis
   */
  static assignLayout(slideType: string, words: string[], rules?: LayoutAssignmentRules): SlideLayout {
    const assignmentRules = rules || this.DEFAULT_RULES

    // First, try to match by slide type
    const layoutId = assignmentRules.slideTypeToLayout[slideType.toLowerCase()]
    if (layoutId) {
      const layout = getLayoutById(layoutId)
      if (layout) return layout
    }

    // Analyze content to determine best layout
    const content = words.join(' ').toLowerCase()

    // Check for specific content patterns
    if (this.isListContent(content)) {
      const layout = getLayoutById('bullet-list')
      if (layout) return layout
    }

    if (this.isQuoteContent(content)) {
      const layout = getLayoutById('quote')
      if (layout) return layout
    }

    if (this.isTitleContent(content, slideType)) {
      const layout = getLayoutById('title-slide')
      if (layout) return layout
    }

    if (this.isComparisonContent(content)) {
      const layout = getLayoutById('two-column')
      if (layout) return layout
    }

    // Fallback to default layout
    const fallbackLayout = getLayoutById(assignmentRules.fallbackLayoutId)
    return fallbackLayout || predefinedLayouts[0]
  }

  /**
   * Assigns a theme based on topic and content analysis
   */
  static assignTheme(topic: string): Theme {
    const topicLower = topic.toLowerCase()

    // Business/Professional content
    if (
      topicLower.includes('business') ||
      topicLower.includes('corporate') ||
      topicLower.includes('finance') ||
      topicLower.includes('strategy')
    ) {
      return predefinedThemes.find((t) => t.id === 'business-professional') || predefinedThemes[0]
    }

    // Educational content
    if (
      topicLower.includes('education') ||
      topicLower.includes('learning') ||
      topicLower.includes('tutorial') ||
      topicLower.includes('course')
    ) {
      return predefinedThemes.find((t) => t.category === 'education') || predefinedThemes[0]
    }

    // Creative content
    if (
      topicLower.includes('creative') ||
      topicLower.includes('design') ||
      topicLower.includes('art') ||
      topicLower.includes('innovation')
    ) {
      return predefinedThemes.find((t) => t.category === 'creative') || predefinedThemes[0]
    }

    // Default to business professional theme
    return predefinedThemes.find((t) => t.id === this.DEFAULT_THEME_ID) || predefinedThemes[0]
  }

  /**
   * Converts streaming slide data to enhanced slide with layout and theme
   */
  static enhanceSlideWithLayout(
    slideId: string,
    slideType: string,
    words: string[],
    topic: string,
    generationParams?: any
  ): GeneratedSlide {
    const layout = this.assignLayout(slideType, words)
    const theme = this.assignTheme(topic)

    // Generate content based on layout regions
    const content = this.generateSlideContent(words, layout, slideType)

    return {
      slideId,
      slideType,
      title: this.extractTitle(words, slideType),
      content,
      layout,
      theme,
      words,
      metadata: {
        generatedAt: new Date().toISOString(),
        generationParams,
        isComplete: true
      }
    }
  }

  /**
   * Generates structured content based on layout regions
   */
  private static generateSlideContent(words: string[], layout: SlideLayout, slideType: string): SlideContent[] {
    const content: SlideContent[] = []
    const fullText = words.join(' ')

    // Map content to layout regions
    for (const region of layout.structure.regions) {
      const regionContent = this.mapContentToRegion(fullText, region, slideType)
      if (regionContent) {
        content.push(regionContent)
      }
    }

    return content
  }

  /**
   * Maps content to a specific layout region
   */
  private static mapContentToRegion(text: string, region: any, slideType: string): SlideContent | null {
    const { id, type, position } = region

    // Extract appropriate content based on region type
    let content = ''

    switch (type) {
      case 'title':
        content = this.extractTitle([text], slideType) || text.split('.')[0]
        break
      case 'subtitle':
        content = this.extractSubtitle(text)
        break
      case 'text':
        content = text
        break
      case 'list':
        content = this.extractListItems(text)
        break
      default:
        content = text
    }

    if (!content) return null

    return {
      id,
      type,
      content,
      position: {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height
      }
    }
  }

  // Content analysis helper methods
  private static isListContent(content: string): boolean {
    const listPatterns = [
      /^\d+\./gm, // Numbered list
      /^[-*•]/gm, // Bullet points
      /^[→➤]/gm // Arrow points
    ]
    return listPatterns.some((pattern) => pattern.test(content))
  }

  private static isQuoteContent(content: string): boolean {
    return (
      content.includes('"') ||
      content.includes('"') ||
      content.includes('"') ||
      content.includes('said') ||
      content.includes('quote')
    )
  }

  private static isTitleContent(content: string, slideType: string): boolean {
    return (
      slideType.toLowerCase().includes('title') || slideType.toLowerCase().includes('intro') || content.length < 100
    )
  }

  private static isComparisonContent(content: string): boolean {
    const comparisonWords = ['vs', 'versus', 'compared to', 'difference', 'comparison', 'contrast']
    return comparisonWords.some((word) => content.toLowerCase().includes(word))
  }

  private static extractTitle(words: string[], slideType: string): string | undefined {
    const text = words.join(' ')

    if (slideType.toLowerCase().includes('title')) {
      // For title slides, use the first sentence or phrase
      const firstSentence = text.split('.')[0]
      return firstSentence.length > 0 ? firstSentence : undefined
    }

    // For other slides, try to extract a title from the beginning
    const sentences = text.split('.')
    if (sentences.length > 0 && sentences[0].length < 100) {
      return sentences[0]
    }

    return undefined
  }

  private static extractSubtitle(text: string): string {
    const sentences = text.split('.')
    if (sentences.length > 1) {
      return sentences[1].trim()
    }
    return ''
  }

  private static extractListItems(text: string): string {
    // Try to format as list if it contains list-like content
    const sentences = text.split('.')
    if (sentences.length > 2) {
      return sentences
        .slice(0, 5)
        .map((sentence, index) => `${index + 1}. ${sentence.trim()}`)
        .join('\n')
    }
    return text
  }
}
