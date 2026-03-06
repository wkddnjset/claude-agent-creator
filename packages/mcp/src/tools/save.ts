import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

interface SaveResult {
  success: boolean;
  claudeMdPath: string;
  metadataPath: string;
  message: string;
}

export function saveConfig(
  content: string,
  outputPath?: string,
  metadata?: Record<string, unknown>,
): SaveResult {
  const claudeMdPath = resolve(outputPath || './CLAUDE.md');
  const metadataPath = resolve(dirname(claudeMdPath), '.anygent.json');

  try {
    mkdirSync(dirname(claudeMdPath), { recursive: true });

    writeFileSync(claudeMdPath, content, 'utf-8');

    const metadataContent = {
      version: '0.1.0',
      createdAt: new Date().toISOString(),
      generatedBy: 'anygent-mcp',
      outputPath: claudeMdPath,
      ...metadata,
    };
    writeFileSync(metadataPath, JSON.stringify(metadataContent, null, 2), 'utf-8');

    return {
      success: true,
      claudeMdPath,
      metadataPath,
      message: `설정 파일이 저장되었습니다!\n- CLAUDE.md: ${claudeMdPath}\n- 메타데이터: ${metadataPath}`,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      claudeMdPath,
      metadataPath,
      message: `저장 중 오류가 발생했습니다: ${errMsg}`,
    };
  }
}
