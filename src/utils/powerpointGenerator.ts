import PptxGenJS from 'pptxgenjs'
import { TypedSlideData } from '../types/slideStream.type'

export interface PowerPointGenerationOptions {
  title: string
  subtitle?: string
  author?: string
  subject?: string
  company?: string
}

export class PowerPointGenerator {
  private pptx: PptxGenJS

  constructor(options: PowerPointGenerationOptions) {
    this.pptx = new PptxGenJS()
    
    // Set presentation properties
    this.pptx.author = options.author || 'GenEdu AI'
    this.pptx.company = options.company || 'GenEdu Platform'
    this.pptx.subject = options.subject || options.title
    this.pptx.title = options.title
  }

  private addWelcomeSlide(slideData: Extract<TypedSlideData, { type: 'welcome' }>) {
    const slide = this.pptx.addSlide()
    
    // Title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1.5,
      fontSize: 36,
      bold: true,
      align: 'center',
      color: '1f4e79'
    })
    
    // Subtitle
    slide.addText(slideData.data.subtitle, {
      x: 0.5,
      y: 4,
      w: 9,
      h: 1,
      fontSize: 24,
      align: 'center',
      color: '666666'
    })
  }

  private addContentSlide(slideData: Extract<TypedSlideData, { type: 'content' }>) {
    const slide = this.pptx.addSlide()
    
    // Title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: '1f4e79'
    })
    
    // Content
    slide.addText(slideData.data.body, {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 5,
      fontSize: 18,
      align: 'left',
      valign: 'top',
      color: '333333',
      wrap: true
    })
  }

  private addListSlide(slideData: Extract<TypedSlideData, { type: 'list' }>) {
    const slide = this.pptx.addSlide()
    
    // Title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: '1f4e79'
    })
    
    // List items
    const listText = slideData.data.items.map(item => `• ${item}`).join('\n')
    slide.addText(listText, {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 5,
      fontSize: 18,
      align: 'left',
      valign: 'top',
      color: '333333',
      bullet: true
    })
  }

  private addCompareSlide(slideData: Extract<TypedSlideData, { type: 'compare' }>) {
    const slide = this.pptx.addSlide()
    
    // Title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 28,
      bold: true,
      color: '1f4e79'
    })
    
    // Left side header
    slide.addText(slideData.data.left_header, {
      x: 0.5,
      y: 1.8,
      w: 4,
      h: 0.8,
      fontSize: 20,
      bold: true,
      color: '1f4e79',
      align: 'center'
    })
    
    // Left side points
    const leftText = slideData.data.left_points.map(point => `• ${point}`).join('\n')
    slide.addText(leftText, {
      x: 0.5,
      y: 2.8,
      w: 4,
      h: 4,
      fontSize: 16,
      align: 'left',
      valign: 'top',
      color: '333333'
    })
    
    // Right side header
    slide.addText(slideData.data.right_header, {
      x: 5.5,
      y: 1.8,
      w: 4,
      h: 0.8,
      fontSize: 20,
      bold: true,
      color: '1f4e79',
      align: 'center'
    })
    
    // Right side points
    const rightText = slideData.data.right_points.map(point => `• ${point}`).join('\n')
    slide.addText(rightText, {
      x: 5.5,
      y: 2.8,
      w: 4,
      h: 4,
      fontSize: 16,
      align: 'left',
      valign: 'top',
      color: '333333'
    })
    
    // Vertical divider line
    slide.addShape('line', {
      x: 5,
      y: 1.8,
      w: 0,
      h: 4.5,
      line: { color: 'cccccc', width: 2 }
    })
  }

  private addThanksSlide(slideData: Extract<TypedSlideData, { type: 'thanks' }>) {
    const slide = this.pptx.addSlide()
    
    // Title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1.5,
      fontSize: 36,
      bold: true,
      align: 'center',
      color: '1f4e79'
    })
    
    // Message
    slide.addText(slideData.data.message, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 1,
      fontSize: 20,
      align: 'center',
      color: '666666'
    })
  }

  public generateFromSlides(slides: TypedSlideData[]): PptxGenJS {
    slides.forEach((slide) => {
      switch (slide.type) {
        case 'welcome':
          this.addWelcomeSlide(slide)
          break
        case 'content':
          this.addContentSlide(slide)
          break
        case 'list':
          this.addListSlide(slide)
          break
        case 'compare':
          this.addCompareSlide(slide)
          break
        case 'thanks':
          this.addThanksSlide(slide)
          break
      }
    })
    
    return this.pptx
  }

  public async saveToBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.pptx.write({ outputType: 'blob' })
        .then((data: string | Blob | ArrayBuffer | Uint8Array) => {
          resolve(data as Blob)
        })
        .catch((error: Error) => {
          reject(error)
        })
    })
  }

  public async downloadFile(filename: string): Promise<void> {
    try {
      const blob = await this.saveToBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      throw new Error('Failed to download PowerPoint file')
    }
  }
}