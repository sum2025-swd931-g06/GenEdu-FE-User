import { PresentationTemplate } from '../components/SlideGenerator/templateConstants'
import { TypedSlideData } from '../types/slideStream.type'

export interface ExportOptions {
  format: 'json' | 'html' | 'pdf' | 'pptx'
  includeTemplate: boolean
  includeNarration: boolean
  fileName?: string
}

export class PresentationExporter {
  static async exportPresentation(
    slides: TypedSlideData[],
    template: PresentationTemplate,
    options: ExportOptions
  ): Promise<Blob> {
    switch (options.format) {
      case 'json':
        return this.exportAsJSON(slides, template, options)
      case 'html':
        return this.exportAsHTML(slides, template, options)
      case 'pdf':
        return this.exportAsPDF(slides, template, options)
      case 'pptx':
        return this.exportAsPPTX(slides, template, options)
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  private static exportAsJSON(slides: TypedSlideData[], template: PresentationTemplate, options: ExportOptions): Blob {
    const exportData = {
      slides: options.includeNarration
        ? slides
        : slides.map(({ narrationScript, ...slide }) => {
            // Remove narrationScript from slide data
            void narrationScript // Mark as used
            return slide
          }),
      template: options.includeTemplate ? template : null,
      exportedAt: new Date().toISOString(),
      options
    }

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
  }

  private static exportAsHTML(slides: TypedSlideData[], template: PresentationTemplate, options: ExportOptions): Blob {
    const htmlContent = this.generateHTMLContent(slides, template, options)
    return new Blob([htmlContent], { type: 'text/html' })
  }

  private static async exportAsPDF(
    slides: TypedSlideData[],
    template: PresentationTemplate,
    options: ExportOptions
  ): Promise<Blob> {
    // For PDF export, we'll generate HTML first and then convert to PDF
    // This is a simplified version - in production, you'd use a library like puppeteer
    const htmlContent = this.generateHTMLContent(slides, template, options)

    // This is a placeholder - in a real app, you'd use a PDF generation library
    return new Blob([htmlContent], { type: 'text/html' })
  }

  private static async exportAsPPTX(
    slides: TypedSlideData[],
    template: PresentationTemplate,
    _options: ExportOptions
  ): Promise<Blob> {
    // This would integrate with a PowerPoint generation library
    // For now, we'll return a placeholder
    const pptxData = {
      slides,
      template,
      format: 'pptx',
      message: 'PowerPoint export would be implemented here'
    }

    return new Blob([JSON.stringify(pptxData)], { type: 'application/json' })
  }

  private static generateHTMLContent(
    slides: TypedSlideData[],
    template: PresentationTemplate,
    options: ExportOptions
  ): string {
    const templateStyles = this.generateTemplateCSS(template)
    const slideHTML = slides.map((slide, index) => this.generateSlideHTML(slide, template, index, options)).join('')

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Presentation</title>
    <style>
        ${templateStyles}
        
        body {
            font-family: ${template.fonts.body};
            margin: 0;
            padding: 0;
            background-color: ${template.colorPalette.background};
            color: ${template.colorPalette.text};
        }
        
        .presentation-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .slide {
            min-height: 600px;
            padding: 40px;
            margin: 20px 0;
            border-radius: ${template.styles.borderRadius};
            page-break-after: always;
        }
        
        .slide h1, .slide h2 {
            font-family: ${template.fonts.heading};
        }
        
        .narration {
            background-color: #f5f5f5;
            padding: 15px;
            border-left: 4px solid ${template.colorPalette.primary};
            margin-top: 20px;
            font-style: italic;
        }
        
        @media print {
            .slide {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <h1 style="color: ${template.colorPalette.primary}; text-align: center; margin-bottom: 40px;">
            Exported Presentation
        </h1>
        ${slideHTML}
    </div>
</body>
</html>`
  }

  private static generateTemplateCSS(template: PresentationTemplate): string {
    return `
        :root {
            --primary-color: ${template.colorPalette.primary};
            --secondary-color: ${template.colorPalette.secondary};
            --accent-color: ${template.colorPalette.accent};
            --background-color: ${template.colorPalette.background};
            --text-color: ${template.colorPalette.text};
            --text-secondary-color: ${template.colorPalette.textSecondary};
            --border-radius: ${template.styles.borderRadius};
        }
    `
  }

  private static generateSlideHTML(
    slide: TypedSlideData,
    template: PresentationTemplate,
    index: number,
    options: ExportOptions
  ): string {
    const slideContent = this.generateSlideContent(slide, template)
    const narrationHTML =
      options.includeNarration && slide.narrationScript
        ? `<div class="narration"><strong>Narration:</strong> ${slide.narrationScript}</div>`
        : ''

    return `
        <div class="slide slide-${slide.type}" style="background-color: ${this.getSlideBackgroundColor(slide.type, template)}">
            <h2 style="color: ${template.colorPalette.primary}; margin-bottom: 20px;">
                Slide ${index + 1}: ${slide.title}
            </h2>
            ${slideContent}
            ${narrationHTML}
        </div>
    `
  }

  private static generateSlideContent(slide: TypedSlideData, template: PresentationTemplate): string {
    switch (slide.type) {
      case 'welcome':
        return `
            <div style="text-align: center; padding: 40px;">
                <h1 style="color: ${template.colorPalette.primary}; font-size: 2.5em; margin-bottom: 20px;">
                    ${slide.title}
                </h1>
                <h2 style="color: ${template.colorPalette.textSecondary}; font-size: 1.5em;">
                    ${slide.data.subtitle}
                </h2>
            </div>
        `
      case 'content':
        return `
            <div style="padding: 20px;">
                <p style="font-size: 1.2em; line-height: 1.6; color: ${template.colorPalette.textSecondary};">
                    ${slide.data.body}
                </p>
            </div>
        `
      case 'list':
        return `
            <div style="padding: 20px;">
                <ul style="font-size: 1.2em; line-height: 1.6; color: ${template.colorPalette.textSecondary};">
                    ${slide.data.items.map((item) => `<li style="margin-bottom: 10px;">${item}</li>`).join('')}
                </ul>
            </div>
        `
      case 'compare':
        return `
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; padding: 20px;">
                <div style="background-color: ${template.colorPalette.primary}20; padding: 20px; border-radius: ${template.styles.borderRadius};">
                    <h3 style="color: ${template.colorPalette.primary}; text-align: center; margin-bottom: 15px;">
                        ${slide.data.left_header}
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${slide.data.left_points.map((point) => `<li style="margin-bottom: 8px;">✓ ${point}</li>`).join('')}
                    </ul>
                </div>
                <div style="display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 1.5em; font-weight: bold; color: ${template.colorPalette.accent};">VS</span>
                </div>
                <div style="background-color: ${template.colorPalette.secondary}20; padding: 20px; border-radius: ${template.styles.borderRadius};">
                    <h3 style="color: ${template.colorPalette.secondary}; text-align: center; margin-bottom: 15px;">
                        ${slide.data.right_header}
                    </h3>
                    <ul style="list-style: none; padding: 0;">
                        ${slide.data.right_points.map((point) => `<li style="margin-bottom: 8px;">✓ ${point}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `
      case 'thanks':
        return `
            <div style="text-align: center; padding: 40px;">
                <h1 style="color: ${template.colorPalette.accent}; font-size: 2.5em; margin-bottom: 20px;">
                    ${slide.title}
                </h1>
                <h2 style="color: ${template.colorPalette.textSecondary}; font-size: 1.5em;">
                    ${slide.data.message}
                </h2>
            </div>
        `
      default:
        return `<div>Unknown slide type</div>`
    }
  }

  private static getSlideBackgroundColor(slideType: string, template: PresentationTemplate): string {
    switch (slideType) {
      case 'welcome':
      case 'thanks':
        return `linear-gradient(135deg, ${template.colorPalette.primary}20, ${template.colorPalette.secondary}20)`
      default:
        return template.colorPalette.background
    }
  }

  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
