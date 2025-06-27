# Reveal.js Slide Viewer Integration

## Overview
The `RevealSlideViewer` component integrates reveal.js with the project detail page to provide professional slide presentations with proper transitions and effects, replacing the previous raw HTML rendering.

## Key Features

### Responsive Design
- **Adaptive Font Sizing**: Uses CSS `clamp()` function for responsive typography
  - Headers: `clamp(1rem, 3.5vw, 1.8rem)` 
  - Body text: `clamp(0.7rem, 2vw, 1rem)`
- **Container-aware Scaling**: Automatically adjusts content based on available space
- **Media Query Support**: Special handling for mobile devices and small containers

### Enhanced User Experience
- **Smooth Transitions**: Professional slide transitions using reveal.js
- **Keyboard Navigation**: Arrow keys for navigation in fullscreen mode
- **External Controls**: Navigation buttons integrated with Ant Design UI
- **Fullscreen Support**: Proper fullscreen mode with reveal.js container

### Performance Optimizations
- **Dynamic Style Injection**: CSS styles are injected only when needed
- **Instance Management**: Proper cleanup of reveal.js instances
- **Memory Efficient**: Destroys and recreates instances when slides change

## Technical Implementation

### Font Scaling Strategy
```css
/* Headers scale from 1rem to 1.8rem based on viewport */
font-size: clamp(1rem, 3.5vw, 1.8rem)

/* Body text scales from 0.7rem to 1rem */
font-size: clamp(0.7rem, 2vw, 1rem)
```

### Responsive Breakpoints
- **Mobile**: `max-width: 768px` - Smaller font sizes
- **Small Height**: `max-height: 400px` - Compressed layout
- **Container-based**: Uses viewport units (vw) for adaptive scaling

### Integration Points
1. **ProjectDetail Component**: Uses `RevealSlideViewer` instead of raw HTML
2. **Navigation Functions**: Connected to reveal.js API for slide control
3. **Keyboard Events**: Properly handled for fullscreen navigation
4. **State Management**: Synchronized slide index between components

## Usage

```tsx
<RevealSlideViewer
  ref={slideViewerRef}
  slides={slides}
  currentSlideIndex={currentSlideIndex}
  onSlideChange={handleSlideChange}
  height='400px'
  embedded={true}
  showControls={false}
/>
```

## Benefits

1. **Professional Appearance**: Slides now look like proper presentations
2. **Better Readability**: Responsive fonts prevent overflow and improve readability
3. **Consistent Styling**: Unified appearance across different screen sizes
4. **Enhanced Navigation**: Smooth transitions and proper keyboard support
5. **Framework Integration**: Seamlessly works with existing Ant Design components

## Files Modified

- `src/components/SlideViewer/RevealSlideViewer.tsx` - Main slide viewer component
- `src/components/SlideViewer/index.ts` - Export declarations
- `src/pages/ProjectDetail/ProjectDetail.tsx` - Integration with project detail page

## Testing

The development server can be started with:
```bash
npm run dev
```

Navigate to a project detail page to see the reveal.js slide viewer in action with responsive font sizing and professional transitions.
