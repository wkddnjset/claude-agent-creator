export function previewConfig(claudeMdContent: string): object {
  const lines = claudeMdContent.split('\n');
  const title = lines.find((l) => l.startsWith('# '))?.replace('# ', '') || '(제목 없음)';

  const sections: string[] = [];
  for (const line of lines) {
    if (line.startsWith('## ')) {
      sections.push(line.replace('## ', ''));
    }
  }

  const lineCount = lines.length;
  const charCount = claudeMdContent.length;

  return {
    title,
    sections,
    stats: {
      lines: lineCount,
      characters: charCount,
    },
    preview: claudeMdContent.slice(0, 500) + (claudeMdContent.length > 500 ? '\n...' : ''),
    fullContent: claudeMdContent,
  };
}
