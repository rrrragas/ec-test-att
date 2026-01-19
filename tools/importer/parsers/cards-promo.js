/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: Image column | Content column (eyebrow, heading, description, legal, CTA)
 *
 * Source HTML Pattern:
 * <section class="hero-flex-cards">
 *   <h1>Main Heading</h1>
 *   <div class="flex-card" data-theme="dark" data-image="./images/card.jpg">
 *     <span class="eyebrow">Eyebrow</span>
 *     <h3>Card Heading</h3>
 *     <p>Description</p>
 *     <p class="legal">Legal text</p>
 *     <a href="/path" class="btn-primary">CTA</a>
 *   </div>
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Get all card elements
  const cards = element.querySelectorAll('.flex-card, [class*="card"]');

  // Build cells array - one row per card
  const cells = [];

  cards.forEach(card => {
    // Extract image from data attribute or img element
    const imageSrc = card.getAttribute('data-image') ||
                     card.querySelector('img')?.src;

    // Extract content
    const eyebrow = card.querySelector('.eyebrow, span:first-child');
    const heading = card.querySelector('h3, h4, [class*="heading"]');
    const description = card.querySelector('p:not(.legal):not(.eyebrow)');
    const legal = card.querySelector('.legal, [class*="legal"]');
    const cta = card.querySelector('.btn-primary, a[class*="btn"], a');

    // Build image cell
    const imageCell = [];
    if (imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = heading?.textContent || 'Card image';
      imageCell.push(img);
    }

    // Build content cell
    const contentCell = [];
    if (eyebrow) {
      const strong = document.createElement('strong');
      strong.textContent = eyebrow.textContent;
      contentCell.push(strong);
    }
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent;
      contentCell.push(h3);
    }
    if (description) contentCell.push(description.cloneNode(true));
    if (legal) {
      const em = document.createElement('em');
      em.textContent = legal.textContent;
      contentCell.push(em);
    }
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.href;
      const strong = document.createElement('strong');
      strong.textContent = cta.textContent;
      link.appendChild(strong);
      contentCell.push(link);
    }

    // Add row with image and content columns
    cells.push([imageCell, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Promo', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
