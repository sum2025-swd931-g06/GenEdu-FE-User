# Enhanced Slide Generator - Usage Guide

## Overview

The enhanced slide generator provides a comprehensive interface for AI-powered slide generation with both demo and production modes. It's designed to work with your current demo API and is ready for backend integration when your API is updated.

## Components

### 1. SlideGeneratorForm

A comprehensive form component that collects all necessary parameters for slide generation.

**Features:**

- Topic and description input
- Slide count configuration (3-20 slides)
- Difficulty levels (beginner, intermediate, advanced)
- Slide type selection (title, content, image, code, diagram, summary)
- Language selection (8+ languages supported)
- Audio generation toggle
- Keywords management
- Additional requirements text area

### 2. StreamingSlideGeneratorV2

The main component that handles slide generation with streaming support.

**Features:**

- Demo mode (uses current GET API)
- Production mode (ready for POST API with form data)
- Real-time streaming with progress tracking
- Live slide preview
- Tab-based interface
- Error handling and recovery
- Authentication support (Keycloak + localStorage fallback)

## Usage

### Basic Implementation

```tsx
import { StreamingSlideGeneratorV2 } from '../components/SlideGenerator'

const MyPage = () => {
  const handleSlidesGenerated = (slides) => {
    console.log('Generated slides:', slides)
    // Handle the slides - save to state, API call, etc.
  }

  return <StreamingSlideGeneratorV2 onSlidesGenerated={handleSlidesGenerated} projectId='optional-project-id' />
}
```

### Form-only Implementation

```tsx
import { SlideGeneratorForm } from '../components/SlideGenerator'

const MyForm = () => {
  const handleGenerate = (params) => {
    console.log('Generation parameters:', params)
    // Use params to call your API
  }

  return <SlideGeneratorForm onGenerate={handleGenerate} loading={false} disabled={false} />
}
```

## API Integration

### Current Demo Mode (GET)

```
GET /api/v1/projects/stream/slide-content
Authorization: Bearer {token}
Accept: text/event-stream;charset=UTF-8
```

### Production Mode (POST) - Ready for Backend

```
POST /api/v1/projects/stream/slide-content
Content-Type: application/json
Authorization: Bearer {token}
Accept: text/event-stream;charset=UTF-8

{
  "topic": "Spring AI Framework",
  "description": "Introduction to Spring AI with practical examples",
  "slideCount": 8,
  "difficulty": "intermediate",
  "slideTypes": ["title", "content", "code", "summary"],
  "includeAudio": true,
  "language": "en",
  "additionalRequirements": "Include practical examples and code snippets",
  "keywords": ["AI", "Spring", "Framework", "Machine Learning"],
  "projectId": "project-123"
}
```

## Server-Sent Events Format

The component expects the following SSE format:

```
id: 1
event: slide-content
data: {"slideId": "1", "slideType": "title", "content": "Introduction to Spring AI"}

id: 2
event: slide-content
data: {"slideId": "1", "slideType": "title", "content": " Framework"}

id: end
event: complete
data: {"message": "Generation completed"}
```

### Event Types

- `slide-content`: Contains slide content chunks
- `complete`: Indicates generation is finished
- `error`: Contains error information

## Configuration

### Environment Variables

```env
# For development debugging
NODE_ENV=development
```

### Authentication

The component supports:

1. Keycloak authentication (primary)
2. localStorage token fallback

## Customization

### Slide Types

You can customize available slide types by modifying the `SLIDE_TYPES` array in `SlideGeneratorForm.tsx`:

```tsx
const SLIDE_TYPES = [
  { value: 'title', label: 'Title Slide', description: 'Introduction and main topic' },
  { value: 'content', label: 'Content Slide', description: 'Main content with bullet points' }
  // Add your custom types here
]
```

### Languages

Add or modify supported languages in the `LANGUAGES` array:

```tsx
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' }
  // Add more languages here
]
```

## Error Handling

The component handles various error scenarios:

- Network connectivity issues
- CORS errors
- Authentication failures
- Server errors
- Streaming interruptions

## Development Notes

### Debug Information

In development mode, debug information is displayed including:

- Authentication status
- Token availability
- Request details
- Generation parameters

### Mode Switching

Use the mode switcher to toggle between:

- **Demo Mode**: Uses current GET API for testing
- **Production Mode**: Uses comprehensive form with POST API

## Next Steps for Backend Integration

1. **Update your API endpoint** to accept POST requests with the form parameters
2. **Implement parameter processing** for topic, slideCount, difficulty, etc.
3. **Add audio generation support** when `includeAudio` is true
4. **Test with different languages** and slide types
5. **Switch to production mode** in the component

The frontend is fully ready - just flip the mode switch when your backend is updated!
