# Development Branch - LUCI Website

This is the development branch for the LUCI website, containing experimental features, media assets, and development tools.

## What's New in Dev Branch

### Media Assets Structure
- Added organized folder structure for images and videos
- Located in `public/media/` directory
- Includes example component showing usage patterns

### Directory Structure
```
public/media/
├── README.md           # Documentation for media assets
├── images/
│   ├── hero/          # Hero section images (.gitkeep)
│   ├── backgrounds/   # Background images (.gitkeep) 
│   └── icons/         # Icons and logos (.gitkeep)
└── videos/
    ├── hero/          # Hero section videos (.gitkeep)
    └── backgrounds/   # Background videos (.gitkeep)
```

### New Components
- `MediaExample.tsx` - Demonstrates how to use media assets in React components

## Usage

### Adding Media Assets

1. **Images**: Place in appropriate subdirectory under `public/media/images/`
2. **Videos**: Place in appropriate subdirectory under `public/media/videos/`
3. **Follow naming convention**: Use lowercase with hyphens (e.g., `hero-background.webp`)

### Referencing Assets in Components

```tsx
// Images with Next.js Image component
<Image
  src="/media/images/hero/quantum-consciousness.webp"
  alt="Description"
  width={1920}
  height={1080}
  priority
/>

// Background videos
<video autoPlay muted loop playsInline>
  <source src="/media/videos/hero/particles.webm" type="video/webm" />
  <source src="/media/videos/hero/particles.mp4" type="video/mp4" />
</video>
```

## File Format Recommendations

### Images
- **WebP**: Preferred for web (smaller file sizes, good quality)
- **PNG**: For images requiring transparency
- **JPG**: For photographs
- **SVG**: For vector graphics and logos

### Videos
- **WebM**: Preferred for web (better compression)
- **MP4**: For broader compatibility
- Always provide both formats when possible

## Optimization Guidelines

1. **Compress before adding**: Use tools like ImageOptim, TinyPNG, or FFmpeg
2. **Appropriate sizing**: Don't upload massive files if they'll be displayed small
3. **Responsive considerations**: Consider different screen sizes
4. **Performance**: Use lazy loading for below-the-fold content

## Development Workflow

1. **Add assets** to appropriate folders
2. **Test locally** to ensure proper loading
3. **Optimize file sizes** before committing
4. **Update examples** if adding new usage patterns
5. **Document** any special requirements or usage notes

## Merging to Main

When media assets and features are ready:
1. Review all file sizes and optimization
2. Test on various devices and screen sizes
3. Ensure proper alt text and accessibility
4. Create pull request with detailed description
5. Merge to main branch for production deployment

## Notes

- Empty directories contain `.gitkeep` files to maintain structure
- All assets are served from `/media/` URL path
- Next.js automatically optimizes images when using the Image component
- Videos should include multiple formats for browser compatibility 