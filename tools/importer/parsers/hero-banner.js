/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image (optional)
 * - Row 2: Content (eyebrow, heading, description, legal, CTAs)
 *
 * Source HTML Pattern:
 * <section class="hero" data-image="./images/hero.jpg" data-theme="dark">
 *   <span class="eyebrow">Eyebrow Text</span>
 *   <h2>Heading</h2>
 *   <p>Description</p>
 *   <p class="legal">Legal text</p>
 *   <a href="/path" class="btn-primary">Primary CTA</a>
 *   <a href="/path" class="btn-secondary">Secondary CTA</a>
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract background image from data attribute or img element
  const bgImageSrc = element.getAttribute('data-image') ||
                     element.querySelector('picture img')?.src ||
                     element.querySelector('img')?.src;

  // Extract content elements
  const eyebrow = element.querySelector('.eyebrow, span:first-child');
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const description = element.querySelector('p:not(.legal):not(.eyebrow)');
  const legal = element.querySelector('.legal, [class*="legal"]');
  const bulletList = element.querySelector('ul');
  const primaryCta = element.querySelector('.btn-primary, a[class*="primary"]');
  const secondaryCta = element.querySelector('.btn-secondary, a[class*="secondary"]');

  // Build cells array
  const cells = [];

  // Row 1: Background image (if present)
  if (bgImageSrc) {
    const img = document.createElement('img');
    img.src = bgImageSrc;
    img.alt = heading?.textContent || 'Hero image';
    cells.push([img]);
  }

  // Row 2: Content
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow.cloneNode(true));
  if (heading) contentCell.push(heading.cloneNode(true));
  if (description) contentCell.push(description.cloneNode(true));
  if (legal) contentCell.push(legal.cloneNode(true));
  if (bulletList) contentCell.push(bulletList.cloneNode(true));
  if (primaryCta) contentCell.push(primaryCta.cloneNode(true));
  if (secondaryCta) contentCell.push(secondaryCta.cloneNode(true));

  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Banner', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
