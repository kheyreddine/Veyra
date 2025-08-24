/**
 * Recently Viewed Products JavaScript
 * Business Problem: Users lose track of products they've viewed, reducing re-engagement
 * Solution: Simple localStorage tracking with clean product display
 * Client Value: Increased product re-engagement, improved conversion rates
 * Technical Achievement: Minimal JavaScript, localStorage API, responsive product grid
 */

(function() {
  'use strict';

  // Recently viewed products functionality
  const RecentlyViewed = {
    storageKey: 'veyra_recently_viewed',
    maxProducts: 6,

    init() {
      this.trackProductViews();
      this.displayRecentlyViewed();
    },

    // Track when user visits a product page
    trackProductViews() {
      // Only track on product pages
      if (!window.location.pathname.includes('/products/')) return;

      // Get current product data from page
      const productHandle = this.getProductHandle();
      if (!productHandle) return;

      // Get existing recently viewed products
      let recentlyViewed = this.getRecentlyViewed();
      
      // Remove if already exists (to avoid duplicates)
      recentlyViewed = recentlyViewed.filter(item => item.handle !== productHandle);
      
      // Add current product to beginning
      const currentProduct = this.getCurrentProductData();
      if (currentProduct) {
        recentlyViewed.unshift(currentProduct);
        
        // Keep only max number of products
        if (recentlyViewed.length > this.maxProducts) {
          recentlyViewed = recentlyViewed.slice(0, this.maxProducts);
        }
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(recentlyViewed));
      }
    },

    // Get product handle from URL
    getProductHandle() {
      const pathParts = window.location.pathname.split('/');
      const productIndex = pathParts.indexOf('products');
      return productIndex !== -1 && pathParts[productIndex + 1] ? pathParts[productIndex + 1] : null;
    },

    // Get current product data from page
    getCurrentProductData() {
      // Try to get from meta tags first
      const title = document.querySelector('meta[property="og:title"]')?.content || 
                   document.querySelector('title')?.textContent || '';
      
      const image = document.querySelector('meta[property="og:image"]')?.content || 
                   document.querySelector('meta[name="twitter:image"]')?.content || '';
      
      const price = document.querySelector('meta[property="product:price:amount"]')?.content || '';
      
      const handle = this.getProductHandle();
      
      if (title && handle) {
        return {
          handle: handle,
          title: title.replace(' | Veyra Clothing', '').trim(),
          image: image,
          price: price ? `$${parseFloat(price).toFixed(2)}` : '',
          url: window.location.pathname
        };
      }
      
      return null;
    },

    // Get recently viewed products from localStorage
    getRecentlyViewed() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    },

    // Display recently viewed products on homepage
    displayRecentlyViewed() {
      const grid = document.getElementById('recently-viewed-grid');
      const placeholder = document.getElementById('recently-viewed-placeholder');
      
      if (!grid) return;

      const recentlyViewed = this.getRecentlyViewed();
      
      if (recentlyViewed.length === 0) {
        // Show placeholder if no products viewed
        if (placeholder) {
          grid.style.display = 'none';
          placeholder.style.display = 'block';
        }
        return;
      }

      // Hide placeholder and show grid
      if (placeholder) {
        placeholder.style.display = 'none';
      }
      grid.style.display = 'grid';

      // Build product cards HTML
      const productsHTML = recentlyViewed.map(product => `
        <div class="recently-viewed__card">
          <a href="${product.url}" class="recently-viewed__card-link">
            <div class="recently-viewed__image-container">
              <img 
                src="${product.image || '/assets/placeholder-product.jpg'}" 
                alt="${product.title}"
                class="recently-viewed__image"
                loading="lazy"
                onerror="this.src='/assets/placeholder-product.jpg'"
              >
            </div>
            <div class="recently-viewed__content">
              <h3 class="recently-viewed__product-title">${product.title}</h3>
              ${product.price ? `<p class="recently-viewed__price">${product.price}</p>` : ''}
            </div>
          </a>
        </div>
      `).join('');

      grid.innerHTML = productsHTML;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => RecentlyViewed.init());
  } else {
    RecentlyViewed.init();
  }
})();
