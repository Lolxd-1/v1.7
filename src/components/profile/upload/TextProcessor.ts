// Text processing utilities
export function processExtractedText(text: string): string {
  if (!text.trim()) return '';

  // Split into sections based on multiple newlines
  const sections = text.split(/\n{2,}/);

  return sections
    .map(section => {
      const lines = section.split('\n');
      
      // Process each line
      const processedLines = lines.map(line => {
        // Trim whitespace while preserving indentation
        const trimmed = line.replace(/\s+$/, '');
        // Preserve special characters and symbols
        return trimmed.replace(/[^\S\n]+/g, ' ');
      });

      // Remove empty lines while preserving structure
      return processedLines
        .filter(line => line.trim())
        .join('\n');
    })
    .filter(section => section.trim())
    .join('\n\n');
}

export function formatTextHierarchy(text: string): string {
  const lines = text.split('\n');
  let formattedText = '';
  let currentSection = '';
  let isMainHeading = true;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      if (currentSection) {
        formattedText += currentSection + '\n\n';
        currentSection = '';
      }
      return;
    }

    // Main heading (all caps)
    if (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 3) {
      if (currentSection) {
        formattedText += currentSection + '\n\n';
        currentSection = '';
      }
      currentSection = isMainHeading ? trimmedLine : '\n' + trimmedLine;
      isMainHeading = false;
    }
    // Subheading (ends with colon)
    else if (trimmedLine.endsWith(':')) {
      currentSection += (currentSection ? '\n' : '') + trimmedLine;
    }
    // List items
    else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      currentSection += '\n  ' + trimmedLine;
    }
    // Regular text
    else {
      currentSection += '\n' + trimmedLine;
    }
  });

  // Add any remaining section
  if (currentSection) {
    formattedText += currentSection;
  }

  return formattedText.trim();
}