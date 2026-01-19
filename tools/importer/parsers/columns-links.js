/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-links block
 *
 * Source: https://www.business.att.com/
 * Base Block: columns
 *
 * Block Structure:
 * - Single row with 4 columns, each containing a list of links
 *
 * Source HTML Pattern:
 * <section class="link-farm">
 *   <h2>Heading</h2>
 *   <ul>
 *     <li><a href="/path1">Link 1</a></li>
 *     <li><a href="/path2">Link 2</a></li>
 *   </ul>
 *   <ul>
 *     <li><a href="/path3">Link 3</a></li>
 *     <li><a href="/path4">Link 4</a></li>
 *   </ul>
 *   <!-- ... more ul elements ... -->
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Get all link list elements
  const linkLists = element.querySelectorAll('ul');

  // Build cells array - single row with multiple columns
  const row = [];

  linkLists.forEach(list => {
    // Clone the list for the column
    const columnContent = [];
    const ul = document.createElement('ul');

    // Extract links from list
    const links = list.querySelectorAll('a');
    links.forEach(link => {
      const li = document.createElement('li');
      const linkClone = link.cloneNode(true);
      li.appendChild(linkClone);
      ul.appendChild(li);
    });

    columnContent.push(ul);
    row.push(columnContent);
  });

  // Build cells with single row containing all columns
  const cells = [row];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Links', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
