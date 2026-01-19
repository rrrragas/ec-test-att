/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stack block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row: Icon column | Content column (heading as link, description)
 *
 * Source HTML Pattern:
 * <section class="story-stack">
 *   <h2>Section Heading</h2>
 *   <p>Section Description</p>
 *   <img src="./images/background.jpg" alt="">
 *   <div class="story-item" data-link="/path">
 *     <img src="./images/icon.svg" alt="">
 *     <h4>Item Heading</h4>
 *     <p>Item Description</p>
 *   </div>
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Get all story item elements
  const items = element.querySelectorAll('.story-item, [class*="story-item"]');

  // Build cells array - one row per item
  const cells = [];

  items.forEach(item => {
    // Extract icon
    const icon = item.querySelector('img');

    // Extract content
    const heading = item.querySelector('h4, h3, [class*="heading"]');
    const description = item.querySelector('p');
    const link = item.getAttribute('data-link') || item.querySelector('a')?.href;

    // Build icon cell
    const iconCell = [];
    if (icon) {
      const iconClone = icon.cloneNode(true);
      iconCell.push(iconClone);
    }

    // Build content cell
    const contentCell = [];
    if (heading && link) {
      // Create linked heading
      const linkEl = document.createElement('a');
      linkEl.href = link;
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent;
      linkEl.appendChild(strong);
      contentCell.push(linkEl);
    } else if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent;
      contentCell.push(strong);
    }
    if (description) contentCell.push(description.cloneNode(true));

    // Add row with icon and content columns
    cells.push([iconCell, contentCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Stack', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
