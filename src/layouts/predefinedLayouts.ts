import type { SlideLayout } from '../types/layout.type'

// 1. Title Slide Layout
export const titleSlideLayout: SlideLayout = {
  id: 'title-slide',
  name: 'Title Slide',
  description: 'Perfect for presentation opening with main title and subtitle',
  category: 'title',
  preview: '/layouts/previews/title-slide.jpg',
  thumbnail: '/layouts/thumbnails/title-slide.jpg',
  structure: {
    regions: [
      {
        id: 'main-title',
        type: 'title',
        position: { x: 10, y: 30, width: 80, height: 25 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '20px'
        },
        defaultContent: {
          text: 'Your Presentation Title',
          placeholder: 'Enter your main title here...',
          fontSize: 'var(--theme-font-size-h1)',
          fontWeight: 'var(--theme-font-weight-bold)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        position: { x: 15, y: 55, width: 70, height: 15 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '10px'
        },
        defaultContent: {
          text: 'Your subtitle or description',
          placeholder: 'Enter subtitle...',
          fontSize: 'var(--theme-font-size-h3)',
          fontWeight: 'var(--theme-font-weight-medium)',
          color: 'var(--theme-text-secondary)'
        }
      }
    ]
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'beginner',
    tags: ['title', 'opening', 'simple']
  }
}

// 2. Content with Image Layout
export const contentImageLayout: SlideLayout = {
  id: 'content-image',
  name: 'Content & Image',
  description: 'Split layout with text content on left and image on right',
  category: 'content',
  preview: '/layouts/previews/content-image.jpg',
  thumbnail: '/layouts/thumbnails/content-image.jpg',
  structure: {
    regions: [
      {
        id: 'title',
        type: 'title',
        position: { x: 5, y: 5, width: 90, height: 15 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'left',
          padding: '10px'
        },
        defaultContent: {
          text: 'Slide Title',
          placeholder: 'Enter slide title...',
          fontSize: 'var(--theme-font-size-h2)',
          fontWeight: 'var(--theme-font-weight-bold)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'content',
        type: 'text',
        position: { x: 5, y: 25, width: 45, height: 65 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'left',
          padding: '20px'
        },
        defaultContent: {
          text: 'Your content goes here. Add bullet points, paragraphs, or any text content.',
          placeholder: 'Enter your content...',
          fontSize: 'var(--theme-font-size-body)',
          fontWeight: 'var(--theme-font-weight-normal)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'image',
        type: 'image',
        position: { x: 55, y: 25, width: 40, height: 65 },
        constraints: { resizable: true, draggable: true, aspectRatio: 1.5 },
        style: {
          padding: '10px',
          borderRadius: 'var(--theme-radius-md)'
        },
        defaultContent: {
          placeholder: 'Click to add image...'
        }
      }
    ]
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'beginner',
    tags: ['content', 'image', 'split', 'basic']
  }
}

// 3. Two Column Layout
export const twoColumnLayout: SlideLayout = {
  id: 'two-column',
  name: 'Two Column',
  description: 'Equal split content layout perfect for comparisons',
  category: 'comparison',
  preview: '/layouts/previews/two-column.jpg',
  thumbnail: '/layouts/thumbnails/two-column.jpg',
  structure: {
    regions: [
      {
        id: 'title',
        type: 'title',
        position: { x: 5, y: 5, width: 90, height: 15 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '10px'
        },
        defaultContent: {
          text: 'Comparison Title',
          placeholder: 'Enter comparison title...',
          fontSize: 'var(--theme-font-size-h2)',
          fontWeight: 'var(--theme-font-weight-bold)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'left-column',
        type: 'text',
        position: { x: 5, y: 25, width: 42.5, height: 65 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'left',
          padding: '20px',
          backgroundColor: 'var(--theme-surface)',
          borderRadius: 'var(--theme-radius-md)'
        },
        defaultContent: {
          text: 'Left column content',
          placeholder: 'Enter left content...',
          fontSize: 'var(--theme-font-size-body)',
          fontWeight: 'var(--theme-font-weight-normal)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'right-column',
        type: 'text',
        position: { x: 52.5, y: 25, width: 42.5, height: 65 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'left',
          padding: '20px',
          backgroundColor: 'var(--theme-surface)',
          borderRadius: 'var(--theme-radius-md)'
        },
        defaultContent: {
          text: 'Right column content',
          placeholder: 'Enter right content...',
          fontSize: 'var(--theme-font-size-body)',
          fontWeight: 'var(--theme-font-weight-normal)',
          color: 'var(--theme-text-primary)'
        }
      }
    ]
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'beginner',
    tags: ['comparison', 'two-column', 'split', 'versus']
  }
}

// 4. Full Image with Caption Layout
export const fullImageLayout: SlideLayout = {
  id: 'full-image',
  name: 'Full Image',
  description: 'Large image with optional title and caption overlay',
  category: 'image',
  preview: '/layouts/previews/full-image.jpg',
  thumbnail: '/layouts/thumbnails/full-image.jpg',
  structure: {
    regions: [
      {
        id: 'background-image',
        type: 'image',
        position: { x: 0, y: 0, width: 100, height: 100 },
        constraints: { resizable: false, draggable: false },
        style: {},
        defaultContent: {
          placeholder: 'Click to add background image...'
        }
      },
      {
        id: 'title-overlay',
        type: 'title',
        position: { x: 10, y: 20, width: 80, height: 20 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 'var(--theme-radius-lg)'
        },
        defaultContent: {
          text: 'Image Title',
          placeholder: 'Enter image title...',
          fontSize: 'var(--theme-font-size-h1)',
          fontWeight: 'var(--theme-font-weight-bold)',
          color: '#ffffff'
        }
      },
      {
        id: 'caption',
        type: 'text',
        position: { x: 15, y: 75, width: 70, height: 15 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 'var(--theme-radius-md)'
        },
        defaultContent: {
          text: 'Image caption or description',
          placeholder: 'Enter caption...',
          fontSize: 'var(--theme-font-size-body)',
          fontWeight: 'var(--theme-font-weight-normal)',
          color: 'var(--theme-text-primary)'
        }
      }
    ]
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'intermediate',
    tags: ['image', 'full-screen', 'overlay', 'caption']
  }
}

// 5. Bullet List Layout
export const bulletListLayout: SlideLayout = {
  id: 'bullet-list',
  name: 'Bullet List',
  description: 'Classic bullet point layout for key points and lists',
  category: 'list',
  preview: '/layouts/previews/bullet-list.jpg',
  thumbnail: '/layouts/thumbnails/bullet-list.jpg',
  structure: {
    regions: [
      {
        id: 'title',
        type: 'title',
        position: { x: 10, y: 10, width: 80, height: 15 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'left',
          padding: '10px'
        },
        defaultContent: {
          text: 'Key Points',
          placeholder: 'Enter title...',
          fontSize: 'var(--theme-font-size-h2)',
          fontWeight: 'var(--theme-font-weight-bold)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'bullet-list',
        type: 'list',
        position: { x: 10, y: 30, width: 80, height: 60 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'left',
          padding: '20px'
        },
        defaultContent: {
          text: '• First key point\n• Second important item\n• Third bullet point\n• Fourth consideration\n• Final thought',
          placeholder: 'Enter bullet points...',
          fontSize: 'var(--theme-font-size-body)',
          fontWeight: 'var(--theme-font-weight-normal)',
          color: 'var(--theme-text-primary)'
        }
      }
    ]
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'beginner',
    tags: ['list', 'bullets', 'points', 'simple']
  }
}

// 6. Quote Layout
export const quoteLayout: SlideLayout = {
  id: 'quote',
  name: 'Quote',
  description: 'Centered quote with attribution for testimonials or famous quotes',
  category: 'quote',
  preview: '/layouts/previews/quote.jpg',
  thumbnail: '/layouts/thumbnails/quote.jpg',
  structure: {
    regions: [
      {
        id: 'quote-text',
        type: 'quote',
        position: { x: 15, y: 25, width: 70, height: 40 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '30px',
          backgroundColor: 'var(--theme-surface)',
          borderRadius: 'var(--theme-radius-lg)'
        },
        defaultContent: {
          text: '"Your inspiring quote goes here"',
          placeholder: 'Enter quote...',
          fontSize: 'var(--theme-font-size-h3)',
          fontWeight: 'var(--theme-font-weight-medium)',
          color: 'var(--theme-text-primary)'
        }
      },
      {
        id: 'attribution',
        type: 'text',
        position: { x: 25, y: 70, width: 50, height: 10 },
        constraints: { resizable: true, draggable: true },
        style: {
          textAlign: 'center',
          padding: '10px'
        },
        defaultContent: {
          text: '— Author Name',
          placeholder: 'Enter attribution...',
          fontSize: 'var(--theme-font-size-body)',
          fontWeight: 'var(--theme-font-weight-normal)',
          color: 'var(--theme-text-secondary)'
        }
      }
    ]
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'beginner',
    tags: ['quote', 'testimonial', 'centered', 'attribution']
  }
}

// 7. Blank Layout
export const blankLayout: SlideLayout = {
  id: 'blank',
  name: 'Blank',
  description: 'Empty canvas for complete creative freedom',
  category: 'blank',
  preview: '/layouts/previews/blank.jpg',
  thumbnail: '/layouts/thumbnails/blank.jpg',
  structure: {
    regions: []
  },
  metadata: {
    aspectRatio: '16:9',
    difficulty: 'advanced',
    tags: ['blank', 'custom', 'creative', 'empty']
  }
}

// Export all layouts
export const predefinedLayouts: SlideLayout[] = [
  titleSlideLayout,
  contentImageLayout,
  twoColumnLayout,
  fullImageLayout,
  bulletListLayout,
  quoteLayout,
  blankLayout
]

export const getLayoutById = (id: string): SlideLayout | undefined => {
  return predefinedLayouts.find((layout) => layout.id === id)
}

export const getLayoutsByCategory = (category: string): SlideLayout[] => {
  if (category === 'all') return predefinedLayouts
  return predefinedLayouts.filter((layout) => layout.category === category)
}

export const getLayoutCategories = (): string[] => {
  const categories = predefinedLayouts.map((layout) => layout.category)
  return ['all', ...Array.from(new Set(categories))]
}
