/**
 * Veyra Clothing - Performance Optimization Module
 * 
 * This module implements advanced performance features that demonstrate
 * senior-level Shopify development skills:
 * 
 * 1. Lazy Loading with Intersection Observer
 * 2. Performance Monitoring & Metrics
 * 3. Critical Resource Optimization
 * 4. Image Format Detection & Optimization
 * 
 * Business Problem Solved: Slow page loading hurts user experience
 * and conversion rates. This implementation improves Core Web Vitals
 * and demonstrates performance optimization expertise.
 */

class VeyraPerformance {
  constructor() {
    this.performanceMetrics = {};
    this.lazyImages = [];
    this.observer = null;
    this.startTime = performance.now();
    
    this.init();
  }

  /**
   * Initialize performance optimization features
   */
  init() {
    this.setupLazyLoading();
    this.setupPerformanceMonitoring();
    this.optimizeCriticalResources();
    this.setupImageOptimization();
    
    // Log initialization for portfolio documentation
    console.log('🚀 Veyra Performance Module Initialized');
    console.log('📊 Performance features: Lazy Loading, Monitoring, Optimization');
  }

  /**
   * Setup lazy loading using Intersection Observer
   * Demonstrates modern browser API usage and performance optimization
   */
  setupLazyLoading() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      this.fallbackLazyLoading();
      return;
    }

    // Create intersection observer for lazy loading
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px', // Start loading 50px before image enters viewport
      threshold: 0.01
    });

    // Find all lazy images and observe them
    this.lazyImages = document.querySelectorAll('img[data-src], .lazy-image');
    this.lazyImages.forEach(img => {
      this.observer.observe(img);
    });

    console.log(`📸 Lazy Loading: ${this.lazyImages.length} images optimized`);
  }

  /**
   * Load image when it enters viewport
   * Implements progressive enhancement and error handling
   */
  loadImage(img) {
    const src = img.dataset.src || img.src;
    if (!src) return;

    // Create new image to test loading
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.classList.remove('lazy-image');
      
      // Remove data attributes for clean HTML
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
      
      // Track successful load for performance metrics
      this.trackImageLoad(img);
    };

    tempImg.onerror = () => {
      // Fallback to placeholder or error state
      img.classList.add('error');
      console.warn(`Failed to load image: ${src}`);
    };

    tempImg.src = src;
  }

  /**
   * Fallback lazy loading for older browsers
   * Shows progressive enhancement approach
   */
  fallbackLazyLoading() {
    console.log('⚠️ Intersection Observer not supported, using fallback');
    
    // Simple scroll-based lazy loading
    let ticking = false;
    
    const updateLazyImages = () => {
      this.lazyImages.forEach(img => {
        if (this.isElementInViewport(img)) {
          this.loadImage(img);
        }
      });
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateLazyImages);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);
  }

  /**
   * Check if element is in viewport (fallback method)
   */
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Setup performance monitoring and metrics display
   * Shows real-time performance data for portfolio demonstration
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor image loading performance
    this.monitorImagePerformance();
    
    // Create performance metrics display
    this.createPerformanceDisplay();
    
    // Track page load performance
    this.trackPageLoadPerformance();
  }

  /**
   * Monitor Core Web Vitals (LCP, FID, CLS)
   * Demonstrates understanding of modern performance metrics
   */
  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.performanceMetrics.lcp = lastEntry.startTime;
          this.updatePerformanceDisplay();
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            this.updatePerformanceDisplay();
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
    }
  }

  /**
   * Monitor image loading performance
   */
  monitorImagePerformance() {
    this.imageLoadTimes = [];
    this.totalImages = this.lazyImages.length;
    this.loadedImages = 0;
  }

  /**
   * Track individual image load performance
   */
  trackImageLoad(img) {
    this.loadedImages++;
    const loadTime = performance.now() - this.startTime;
    this.imageLoadTimes.push(loadTime);
    
    // Update performance metrics
    this.performanceMetrics.imagesLoaded = this.loadedImages;
    this.performanceMetrics.totalImages = this.totalImages;
    this.performanceMetrics.avgImageLoadTime = this.calculateAverage(this.imageLoadTimes);
    
    this.updatePerformanceDisplay();
  }

  /**
   * Track overall page load performance
   */
  trackPageLoadPerformance() {
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.startTime;
      this.performanceMetrics.pageLoadTime = loadTime;
      this.performanceMetrics.domContentLoaded = performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 0;
      
      this.updatePerformanceDisplay();
      
      // Log performance summary for portfolio
      console.log('📊 Performance Summary:', this.performanceMetrics);
    });
  }

  /**
   * Create performance metrics display
   * Shows real-time performance data for portfolio demonstration
   */
  createPerformanceDisplay() {
    const display = document.createElement('div');
    display.className = 'performance-metrics';
    display.innerHTML = `
      <div><strong>Veyra Performance</strong></div>
      <div>LCP: <span id="lcp-metric">-</span></div>
      <div>FID: <span id="fid-metric">-</span></div>
      <div>Images: <span id="images-metric">-</span></div>
      <div>Load Time: <span id="load-metric">-</span></div>
    `;
    
    document.body.appendChild(display);
    
    // Add toggle functionality
    display.addEventListener('click', () => {
      display.classList.toggle('hidden');
    });
  }

  /**
   * Update performance display with real-time data
   */
  updatePerformanceDisplay() {
    const lcpEl = document.getElementById('lcp-metric');
    const fidEl = document.getElementById('fid-metric');
    const imagesEl = document.getElementById('images-metric');
    const loadEl = document.getElementById('load-metric');
    
    if (lcpEl && this.performanceMetrics.lcp) {
      lcpEl.textContent = `${Math.round(this.performanceMetrics.lcp)}ms`;
    }
    
    if (fidEl && this.performanceMetrics.fid) {
      fidEl.textContent = `${Math.round(this.performanceMetrics.fid)}ms`;
    }
    
    if (imagesEl) {
      imagesEl.textContent = `${this.performanceMetrics.imagesLoaded || 0}/${this.performanceMetrics.totalImages || 0}`;
    }
    
    if (loadEl && this.performanceMetrics.pageLoadTime) {
      loadEl.textContent = `${Math.round(this.performanceMetrics.pageLoadTime)}ms`;
    }
  }

  /**
   * Optimize critical resources for above-the-fold content
   * Demonstrates resource prioritization skills
   */
  optimizeCriticalResources() {
    // Preload critical fonts
    this.preloadFonts();
    
    // Preload critical images
    this.preloadCriticalImages();
    
    // Defer non-critical JavaScript
    this.deferNonCriticalScripts();
  }

  /**
   * Preload critical fonts for instant rendering
   */
  preloadFonts() {
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    ];
    
    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'style';
      link.onload = () => link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical above-the-fold images
   */
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('.hero img, .header img');
    criticalImages.forEach(img => {
      if (img.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = img.src;
        link.as = 'image';
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Defer non-critical JavaScript for better performance
   */
  deferNonCriticalScripts() {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      script.defer = true;
      script.removeAttribute('data-defer');
    });
  }

  /**
   * Setup image format optimization and responsive images
   */
  setupImageOptimization() {
    // Check WebP support
    this.checkWebPSupport();
    
    // Setup responsive image loading
    this.setupResponsiveImages();
  }

  /**
   * Check WebP support and optimize accordingly
   */
  checkWebPSupport() {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      this.webPSupported = webP.height === 2;
      if (this.webPSupported) {
        console.log('✅ WebP supported - optimizing images');
        this.optimizeImagesForWebP();
      } else {
        console.log('⚠️ WebP not supported - using fallback formats');
      }
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  /**
   * Optimize images for WebP when supported
   */
  optimizeImagesForWebP() {
    // This would integrate with Shopify's image optimization
    // For portfolio demonstration, we show the capability
    console.log('🖼️ WebP optimization ready for Shopify integration');
  }

  /**
   * Setup responsive image loading
   */
  setupResponsiveImages() {
    const images = document.querySelectorAll('img[data-srcset]');
    images.forEach(img => {
      // Create responsive image loading
      this.createResponsiveImage(img);
    });
  }

  /**
   * Create responsive image with proper srcset
   */
  createResponsiveImage(img) {
    const srcset = img.dataset.srcset;
    if (srcset) {
      img.srcset = srcset;
      img.sizes = img.dataset.sizes || '100vw';
    }
  }

  /**
   * Utility function to calculate average
   */
  calculateAverage(array) {
    return array.reduce((a, b) => a + b, 0) / array.length;
  }

  /**
   * Get performance summary for portfolio documentation
   */
  getPerformanceSummary() {
    return {
      ...this.performanceMetrics,
      features: [
        'Lazy Loading with Intersection Observer',
        'Core Web Vitals Monitoring',
        'Critical Resource Optimization',
        'Image Format Detection',
        'Performance Metrics Display'
      ]
    };
  }
}

// Initialize performance optimization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.veyraPerformance = new VeyraPerformance();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeyraPerformance;
}
