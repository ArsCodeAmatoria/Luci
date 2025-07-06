/**
 * MediaExample Component
 * 
 * Demonstrates how to use media assets from the /public/media/ directory
 * in React components for the LUCI website.
 */



export default function MediaExample() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-purple-400">Media Assets Examples</h2>
      
      {/* Hero Images Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-300">Hero Images</h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            {`// Example: Hero background image
<Image
  src="/media/images/hero/quantum-consciousness.webp"
  alt="Quantum consciousness visualization"
  width={1920}
  height={1080}
  className="rounded-lg"
  priority
/>`}
          </code>
        </div>
      </div>

      {/* Background Images Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-300">Background Images</h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            {`// Example: Section background
<div 
  className="py-24 px-4 bg-cover bg-center"
  style={{
    backgroundImage: "url('/media/images/backgrounds/particle-field.webp')"
  }}
>
  {/* Content */}
</div>`}
          </code>
        </div>
      </div>

      {/* Icons Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-300">Icons & Graphics</h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            {`// Example: LUCI logo
<Image
  src="/media/images/icons/luci-logo.svg"
  alt="LUCI Logo"
  width={120}
  height={40}
  className="hover:opacity-80 transition-opacity"
/>`}
          </code>
        </div>
      </div>

      {/* Hero Videos Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-300">Hero Videos</h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            {`// Example: Hero background video
<video 
  className="absolute inset-0 w-full h-full object-cover"
  autoPlay 
  muted 
  loop 
  playsInline
>
  <source src="/media/videos/hero/quantum-particles.webm" type="video/webm" />
  <source src="/media/videos/hero/quantum-particles.mp4" type="video/mp4" />
</video>`}
          </code>
        </div>
      </div>

      {/* Background Videos Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-300">Background Videos</h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-green-400 text-sm">
            {`// Example: Section background video
<div className="relative overflow-hidden">
  <video 
    className="absolute inset-0 w-full h-full object-cover opacity-20"
    autoPlay 
    muted 
    loop 
    playsInline
  >
    <source src="/media/videos/backgrounds/floating-particles.webm" type="video/webm" />
    <source src="/media/videos/backgrounds/floating-particles.mp4" type="video/mp4" />
  </video>
  <div className="relative z-10">
    {/* Content over video */}
  </div>
</div>`}
          </code>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-300">Best Practices</h3>
        <ul className="text-gray-400 space-y-2 list-disc list-inside">
          <li>Use Next.js Image component for optimized loading</li>
          <li>Provide multiple video formats (webm, mp4) for compatibility</li>
          <li>Add proper alt text for accessibility</li>
          <li>Use priority loading for above-the-fold images</li>
          <li>Consider lazy loading for below-the-fold content</li>
          <li>Compress images and videos before adding to repository</li>
        </ul>
      </div>
    </div>
  );
} 