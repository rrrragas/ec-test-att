/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for AT&T Business website cleanup
 * Purpose: Remove non-content elements and fix DOM issues
 * Applies to: www.business.att.com (all pages)
 * Generated: 2026-01-19
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 * - Cleaned HTML analysis from page migration
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent and privacy banners
    // Extracted from AT&T Business DOM
    WebImporter.DOMUtils.remove(element, [
      '#att-cookie-banner',
      '[class*="cookie"]',
      '[class*="consent"]',
      '[id*="privacy"]'
    ]);

    // Remove chat widgets and overlays
    WebImporter.DOMUtils.remove(element, [
      '[class*="chat-widget"]',
      '[class*="live-chat"]',
      '.overlay',
      '.modal-backdrop'
    ]);

    // Remove navigation and footer (handled by fragments)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav:not(.headband)'
    ]);

    // Re-enable scrolling if disabled
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up tracking attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('onmouseover');
    });

    // Remove remaining unwanted elements
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'iframe',
      'link',
      'noscript',
      'source'
    ]);
  }
}
