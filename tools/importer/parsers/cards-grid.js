/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-grid block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: Image column | Content column (heading, description, link)
 *
 * Source HTML Pattern:
 * <section class="value-props">
 *   <div class="value-prop">
 *     <img src="./images/icon.svg" alt="">
 *     <h4>Heading</h4>
 *     <p>Description</p>
 *     <p class="legal">Legal text (optional)</p>
 *     <a href="/path">Link text</a>
 *   </div>
 * </section>
 *
 * OR
 *
 * <section class="multi-tile-cards">
 *   <div class="card">
 *     <img src="./images/tile.png" alt="">
 *     <h3>Heading</h3>
 *     <p>Description</p>
 *     <a href="/path">Link text</a>
 *   </div>
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Get all card/value-prop elements
  const cards = element.querySelectorAll('.card, .value-prop, [class*="card"]:not(.multi-tile-cards)');

  // Build cells array - one row per card
  const cells = [];

  cards.forEach(card => {
    // Extract image
    const img = card.querySelector('img');

    // Extract content
    const heading = card.querySelector('h3, h4, [class*="heading"]');
    const description = card.querySelector('p:not(.legal)');
    const legal = card.querySelector('.legal, [class*="legal"]');
    const link = card.querySelector('a');

    // Build image cell
    const imageCell = [];
    if (img) {
      const imgClone = img.cloneNode(true);
      imageCell.push(imgClone);
    }

    // Build content cell
    const contentCell = [];
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent;
      contentCell.push(strong);
    }
    if (description) contentCell.push(description.cloneNode(true));
    if (legal) {
      const em = document.createElement('em');
      em.textContent = legal.textContent;
      contentCell.push(em);
    }
    if (link) {
      const linkClone = link.cloneNode(true);
      contentCell.push(linkClone);
    }

    // Add row with image and content columns
    cells.push([imageCell, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Grid', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
