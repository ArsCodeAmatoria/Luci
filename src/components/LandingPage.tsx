"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

// Define proper types for particles
interface HeroParticle {
  width: number;
  height: number;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

interface CTAParticle {
  width: number;
  height: number;
  top: string;
  left: string;
  transform: string;
}

// Define a simple animation utility
const SimpleTween = {
  fadeIn: (element: HTMLElement, duration: number = 500, delay: number = 0) => {
    if (!element) return;
    
    setTimeout(() => {
      element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  },
  
  stagger: (elements: NodeListOf<HTMLElement> | HTMLElement[], duration: number = 500, staggerDelay: number = 100) => {
    if (!elements || elements.length === 0) return;
    
    Array.from(elements).forEach((el, index) => {
      setTimeout(() => {
        el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * staggerDelay);
    });
  }
};

export default function LandingPage() {
  // References for animated elements
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLParagraphElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  
  // State for randomly generated elements to avoid hydration mismatch
  const [heroParticles, setHeroParticles] = useState<HeroParticle[]>([]);
  const [ctaParticles, setCtaParticles] = useState<CTAParticle[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Generate particles on client-side only
  useEffect(() => {
    // Generate hero section particles
    const heroParticlesData = Array(25).fill(0).map(() => ({
      width: Math.random() * 100 + 20,
      height: Math.random() * 100 + 20,
      top: `${Math.random() * 120 - 10}%`,
      left: `${Math.random() * 120 - 10}%`,
      animationDuration: `${Math.random() * 30 + 15}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setHeroParticles(heroParticlesData);

    // Generate CTA section particles
    const ctaParticlesData = Array(12).fill(0).map(() => ({
      width: Math.random() * 400 + 100,
      height: Math.random() * 400 + 100,
      top: `${Math.random() * 120 - 10}%`,
      left: `${Math.random() * 120 - 10}%`,
      transform: `scale(${Math.random() * 0.8 + 0.3})`,
    }));
    setCtaParticles(ctaParticlesData);
    
    setInitialized(true);
  }, []);

  // Animation setup on component mount
  useEffect(() => {
    if (!initialized) return;
    
    try {
      // Animate hero section elements with our simple animation utility
      if (heroTitleRef.current) {
        SimpleTween.fadeIn(heroTitleRef.current, 1200, 0);
      }
      
      if (heroSubtitleRef.current) {
        SimpleTween.fadeIn(heroSubtitleRef.current, 1200, 200);
      }
      
      if (heroTextRef.current) {
        SimpleTween.fadeIn(heroTextRef.current, 1000, 400);
      }
      
      if (buttonContainerRef.current && buttonContainerRef.current.children.length > 0) {
        SimpleTween.stagger(
          Array.from(buttonContainerRef.current.children) as HTMLElement[],
          800,
          150
        );
      }
      
      // Set up animations for other sections when they come into view
      setupScrollAnimations();
    } catch (error) {
      console.error("Animation error:", error);
    }
  }, [initialized]);

  // Function to set up scroll-triggered animations
  const setupScrollAnimations = () => {
    // Find all animatable elements
    const featuresTitleEl = document.querySelector('#features h2');
    const featureCards = document.querySelectorAll('#features .feature-card');
    const howItWorksTitleEl = document.querySelector('#how-it-works h2');
    const stepCards = document.querySelectorAll('#how-it-works .step-card');
    const ctaSection = document.querySelector('#cta');

    // Features title animation
    if (featuresTitleEl) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            SimpleTween.fadeIn(featuresTitleEl as HTMLElement, 800);
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(featuresTitleEl);
    }

    // Feature cards animations
    if (featureCards.length > 0) {
      featureCards.forEach((card, index) => {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              SimpleTween.fadeIn(card as HTMLElement, 800, index * 150);
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(card);
      });
    }

    // How it works title animation
    if (howItWorksTitleEl) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            SimpleTween.fadeIn(howItWorksTitleEl as HTMLElement, 800);
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(howItWorksTitleEl);
    }

    // Step cards animations
    if (stepCards.length > 0) {
      stepCards.forEach((card, index) => {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              SimpleTween.fadeIn(card as HTMLElement, 800, index * 200);
              
              // Animate the number
              const numberEl = card.querySelector('.step-number');
              if (numberEl) {
                setTimeout(() => {
                  const stepNumber = parseInt(numberEl.getAttribute('data-step') || '0', 10);
                  const duration = 1500;
                  const startTime = performance.now();
                  
                  const updateNumber = (timestamp: number) => {
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentValue = Math.round(progress * stepNumber);
                    
                    numberEl.textContent = currentValue.toString();
                    
                    if (progress < 1) {
                      requestAnimationFrame(updateNumber);
                    }
                  };
                  
                  requestAnimationFrame(updateNumber);
                }, index * 200 + 400);
              }
              
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(card);
      });
    }

    // CTA section animations
    if (ctaSection) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const titleEl = ctaSection.querySelector('h2');
            const textEl = ctaSection.querySelector('p');
            const buttonEl = ctaSection.querySelector('a');

            if (titleEl) SimpleTween.fadeIn(titleEl as HTMLElement, 800, 0);
            if (textEl) SimpleTween.fadeIn(textEl as HTMLElement, 800, 200);
            if (buttonEl) SimpleTween.fadeIn(buttonEl as HTMLElement, 800, 400);
            
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(ctaSection);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100">
      {/* Hero Section */}
      <section 
        ref={heroSectionRef}
        className="flex flex-col items-center justify-center py-32 px-4 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f0f1e 0%, #151528 100%)',
          boxShadow: 'inset 0 0 100px rgba(78, 33, 202, 0.15)'
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {heroParticles.map((particle, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(79, 70, 229, 0) 70%)',
                width: particle.width,
                height: particle.height,
                top: particle.top,
                left: particle.left,
                animation: `float ${particle.animationDuration} ease-in-out infinite alternate`,
                animationDelay: particle.animationDelay,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 
            ref={heroSubtitleRef}
            className="uppercase tracking-widest text-purple-400 text-sm mb-4 font-medium opacity-0 transform translate-y-8"
            style={{transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'}}
          >
            Introducing Luci
          </h2>
          <h1 
            ref={heroTitleRef}
            className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6 opacity-0 transform translate-y-8"
            style={{
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
              textShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            <span className="inline bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600">
              AI-Powered Call Assistant
            </span>
          </h1>
          <p 
            ref={heroTextRef}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto opacity-0 transform translate-y-8"
            style={{transition: 'opacity 1s ease-out, transform 1s ease-out'}}
          >
            Enhance your phone calls with real-time AI assistance, transcriptions, and intelligent insights.
          </p>
          <div 
            ref={buttonContainerRef}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/signup"
              className="opacity-0 transform translate-y-8 px-8 py-4 rounded-full font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-glow"
              style={{
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out, all 0.3s',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
              }}
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="opacity-0 transform translate-y-8 px-8 py-4 rounded-full border border-purple-700 font-medium hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
              style={{transition: 'opacity 0.8s ease-out, transform 0.8s ease-out, all 0.3s'}}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Decorative grid */}
        <div className="absolute inset-0 z-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)', 
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}></div>

        {/* Glow effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ 
          background: 'linear-gradient(to top, rgba(139, 92, 246, 0.15), transparent)'
        }}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 opacity-0 transform translate-y-10"
              style={{transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'}}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Key Features
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Real-time Transcription",
                description: "Convert your conversations into text instantly, making it easy to review important details later.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ),
                gradient: "from-blue-400 to-cyan-400",
                bgColor: "rgba(59, 130, 246, 0.1)",
                border: "rgba(59, 130, 246, 0.2)",
                hoverBorder: "rgba(59, 130, 246, 0.4)",
              },
              {
                title: "Smart Suggestions",
                description: "Get intelligent recommendations during calls to help you communicate more effectively.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                gradient: "from-purple-400 to-pink-400",
                bgColor: "rgba(139, 92, 246, 0.1)",
                border: "rgba(139, 92, 246, 0.2)",
                hoverBorder: "rgba(139, 92, 246, 0.4)",
              },
              {
                title: "Privacy-Focused",
                description: "Your conversations are encrypted and processed securely, ensuring your data remains private.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                gradient: "from-green-400 to-emerald-400",
                bgColor: "rgba(16, 185, 129, 0.1)",
                border: "rgba(16, 185, 129, 0.2)",
                hoverBorder: "rgba(16, 185, 129, 0.4)",
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="feature-card flex flex-col p-8 rounded-2xl backdrop-blur-sm opacity-0 transform translate-y-10 transition-all duration-300 hover:scale-105"
                style={{
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out, all 0.3s',
                  background: feature.bgColor,
                  border: `1px solid ${feature.border}`,
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = feature.hoverBorder;
                  e.currentTarget.style.boxShadow = '0 8px 35px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = feature.border;
                  e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div className={`w-14 h-14 rounded-full mb-6 flex items-center justify-center text-${feature.gradient.split('-')[1]}-400 bg-${feature.gradient.split('-')[1]}-900/20`}>
                  <div className={`bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f0f1e 0%, #151528 100%)',
        boxShadow: 'inset 0 0 100px rgba(78, 33, 202, 0.15)'
      }}>
        {/* Decorative grid */}
        <div className="absolute inset-0 z-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)', 
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-20 opacity-0 transform translate-y-10"
              style={{transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'}}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              How It Works
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Install the App",
                description: "Download Luci from your app store and create your account."
              },
              {
                step: 2,
                title: "Connect Your Phone",
                description: "Grant necessary permissions to enable Luci to assist with your calls."
              },
              {
                step: 3,
                title: "Make a Call",
                description: "Use your phone as usual, and Luci will activate automatically."
              },
              {
                step: 4,
                title: "Get Assistance",
                description: "Receive real-time transcriptions, suggestions, and insights during your call."
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="step-card flex flex-col items-center text-center opacity-0 transform translate-y-10 transition-all duration-300 hover:translate-y-[-5px]"
                style={{transition: 'opacity 0.8s ease-out, transform 0.8s ease-out, all 0.3s'}}
              >
                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-full bg-opacity-20 bg-purple-800 flex items-center justify-center relative z-10" style={{
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                  }}>
                    <span className="step-number text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400" data-step={step.step}>0</span>
                  </div>
                  {/* Connecting line */}
                  {index < 3 && (
                    <div className="absolute top-1/2 left-[100%] w-full h-0.5 bg-gradient-to-r from-purple-600 to-transparent -translate-y-1/2 hidden lg:block"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, rgba(0, 0, 0, 0) 70%)'
        }}>
          {ctaParticles.map((particle, i) => (
            <div 
              key={i}
              className="absolute opacity-10"
              style={{
                width: particle.width,
                height: particle.height,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0) 70%)',
                top: particle.top,
                left: particle.left,
                transform: particle.transform,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 opacity-0 transform translate-y-8"
              style={{transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'}}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Ready to transform your calls?
            </span>
          </h2>
          <p className="text-xl mb-10 text-gray-300 opacity-0 transform translate-y-8" 
             style={{transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'}}>
            Join thousands of users who are enhancing their conversations with AI assistance.
          </p>
          <Link
            href="/signup"
            className="px-10 py-4 rounded-full font-medium inline-block opacity-0 transform translate-y-8 transition-all duration-300 hover:scale-105 hover:shadow-glow"
            style={{
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out, all 0.3s',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Luci</h3>
              <p className="text-gray-400 mt-2">AI-powered call assistant</p>
            </div>
            
            <div className="flex space-x-8">
              <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Luci. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .hover\:shadow-glow:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 15px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
} 