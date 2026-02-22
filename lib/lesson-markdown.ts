function isPipeTableLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('```')) {
    return false;
  }
  const pipeMatches = trimmed.match(/\|/g);
  return Boolean(pipeMatches && pipeMatches.length >= 2);
}

function splitPipeCells(line: string): string[] {
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);
}

function isDividerRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell.replace(/\s+/g, '')));
}

function isVocabularyHeader(cells: string[]): boolean {
  const normalized = cells.map((cell) => cell.toLowerCase());
  return normalized.some((cell) => cell.includes('term')) && normalized.some((cell) => cell.includes('definition'));
}

function flushPipeTable(tableBuffer: string[], output: string[]): void {
  const parsedRows = tableBuffer
    .map(splitPipeCells)
    .filter((cells) => cells.length > 0 && !isDividerRow(cells));

  if (parsedRows.length === 0) {
    return;
  }

  const hasHeader = parsedRows.length > 1;
  const header = hasHeader ? parsedRows[0] : [];
  const bodyRows = hasHeader ? parsedRows.slice(1) : parsedRows;

  if (header.length && isVocabularyHeader(header)) {
    output.push('### Key Vocabulary');
    if (bodyRows.length === 0) {
      output.push('- Add vocabulary terms.');
      output.push('');
      return;
    }

    bodyRows.forEach((row, index) => {
      const [term, definition, prompt] = row;
      output.push(`- **${term || `Term ${index + 1}`}**`);
      if (definition) {
        output.push(`  - Student-Friendly Definition: ${definition}`);
      }
      if (prompt) {
        output.push(`  - Child-Friendly Illustration Prompt: ${prompt}`);
      }
    });
    output.push('');
    return;
  }

  if (!hasHeader) {
    bodyRows.forEach((row) => {
      output.push(`- ${row.join('; ')}`);
    });
    output.push('');
    return;
  }

  bodyRows.forEach((row) => {
    const pairs = row
      .map((cell, index) => {
        const label = header[index] || `Column ${index + 1}`;
        return cell ? `${label}: ${cell}` : null;
      })
      .filter((pair): pair is string => Boolean(pair));
    if (pairs.length > 0) {
      output.push(`- ${pairs.join('; ')}`);
    }
  });
  output.push('');
}

export function normalizeLessonMarkdown(markdown: string): string {
  if (!markdown) {
    return '';
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let tableBuffer: string[] = [];

  for (const line of lines) {
    if (isPipeTableLine(line)) {
      tableBuffer.push(line);
      continue;
    }

    if (tableBuffer.length > 0) {
      flushPipeTable(tableBuffer, output);
      tableBuffer = [];
    }

    const trimmed = line.trim();
    if (/^[-*_]{3,}$/.test(trimmed)) {
      continue;
    }

    output.push(line);
  }

  if (tableBuffer.length > 0) {
    flushPipeTable(tableBuffer, output);
  }

  return output
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
