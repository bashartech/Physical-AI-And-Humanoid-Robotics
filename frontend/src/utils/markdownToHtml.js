
/**
 * Attempts to convert markdown to HTML. If the input already appears to be HTML,
 * it returns the input as-is (or with minimal processing).
 * This is a simplified processor and might not handle all edge cases perfectly.
 */
function markdownToHtml(inputText) {
  // Check if the input already contains common HTML tags.
  // If so, assume it's HTML and return as-is.
  if (/<\/?[a-z][\s\S]*>/i.test(inputText)) {
    // It looks like HTML, return as-is for the browser to render.
    // You might want to sanitize this in a production environment.
    console.log("Input appears to be HTML, returning as-is.");
    return inputText;
  }

  // If it doesn't look like HTML, assume it's Markdown and process it.
  console.log("Processing input as Markdown.");
  let html = inputText;

  // 1. Protect code blocks and inline code first
  const codeBlockRegex = /(```[\s\S]*?```|`[^`]*`)/g;
  const codeBlocks = [];
  html = html.replace(codeBlockRegex, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // 2. Process block-level elements first (headings, lists, blockquotes, etc.)
  // Headings
  html = html.replace(/^\s*###### (.*$)/gm, '<h6>$1</h6>');
  html = html.replace(/^\s*##### (.*$)/gm, '<h5>$1</h5>');
  html = html.replace(/^\s*#### (.*$)/gm, '<h4>$1</h4>');
  html = html.replace(/^\s*### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^\s*## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^\s*# (.*$)/gm, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^\s*> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Lists - Process them carefully
  // Unordered lists
  html = html.replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>');
  // Ordered lists
  html = html.replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap list items in <ul> or <ol>. This is complex; let's simplify.
  // Find consecutive <li> items and wrap them.
  // For unordered
  html = html.replace(/(<li>.*?)(?=\n\s*\n|$)/gs, (match) => {
      if (match.includes('<li>')) {
          return `<ul>${match}</ul>`;
      }
      return match;
  });
  // For ordered
  html = html.replace(/(<li>.*?)(?=\n\s*\n|$)/gs, (match) => {
      if (match.includes('<li>') && !match.includes('<ul>')) { // Avoid double-wrapping if UL was already applied
          // Check if it looks like an ordered list by content
          if (match.includes('</li>')) { // Basic check
              return `<ol>${match}</ol>`;
          }
      }
      return match;
  });
  // A simpler, more reliable way might be to find patterns like \n<li>.*?\n\n and wrap them.
  html = html.replace(/\n(<li>.*?)(?=\n\s*\n|\n\s*#|\n\s*<h|\n\s*<blockquote|$)/gs, (match, listItems) => {
      // Check if it's unordered or ordered based on the content of the first item
      if (listItems.includes('<li>') && !listItems.includes('<ul>') && !listItems.includes('<ol>')) {
          if (listItems.match(/^\s*\d+\./m)) {
              return `\n<ol>${listItems}</ol>\n`;
          } else {
              return `\n<ul>${listItems}</ul>\n`;
          }
      }
      return match; // Return original if already wrapped or not a list
  });

  // 3. Process inline elements (bold, italic, links, images) - These can appear inside block elements
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');

  // 4. Handle horizontal rules
  html = html.replace(/^\s*---\s*$/gm, '<hr />');

  // 5. Convert remaining standalone lines to paragraphs
  // This must be done *after* processing lists and other block elements to avoid wrapping them
  html = html.replace(/^\s*(?!<h|<ul|<ol|<li|<img|<blockquote|<hr|<div)(.+)$/gm, '<p>$1</p>');

  // 6. Handle line breaks within paragraphs (e.g., soft breaks in markdown)
  // This is tricky and often relies on two spaces before a newline, which is not captured here.
  // For now, let's assume paragraphs are separated by newlines.
  // If the AI returns multi-line paragraphs, this might need adjustment.
  html = html.replace(/<p>([\s\S]*?)\n([\s\S]*?)<\/p>/g, '<p>$1<br />$2</p>');


  // 7. Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    html = html.replace(new RegExp(`__CODE_BLOCK_${i}__`, 'g'), codeBlocks[i]);
  }

  // 8. Final cleanup
  html = html.replace(/<p>\s*<\/p>/g, '');
  // Ensure block elements don't get wrapped in paragraphs
  html = html.replace(/<p>(\s*<(h[1-6]|ul|ol|li|img|blockquote|hr))(\s|>)/g, '$1$3');
  html = html.replace(/(<\/(h[1-6]|ul|ol|li|img|blockquote|hr)>)\s*<\/p>/g, '$1');

  return html;
}

export default markdownToHtml;
