import { describe, expect, it } from 'vitest';
import { migrateStepToBlocks } from '../../utils/blockMigration';
import { GuideStep } from '../../types/docs';
import { Block } from '../../types/blocks';

describe('migrateStepToBlocks', () => {
  it('returns existing blocks when they are already present', () => {
    const existingBlocks: Block[] = [
      { id: '1', type: 'text', content: '<p>Already migrated</p>' },
    ];
    const step: GuideStep = {
      id: 's1',
      title: 'Step 1',
      content: 'Legacy content',
      blocks: existingBlocks,
    };

    const result = migrateStepToBlocks(step);
    expect(result).toBe(existingBlocks); // Same reference — idempotent
  });

  it('returns empty blocks for a step with no legacy content', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Empty Step',
      content: '',
      blocks: [],
    };

    // blocks.length is 0, so it should go through migration, but content is empty
    const result = migrateStepToBlocks(step);
    expect(result).toEqual([]);
  });

  it('migrates text content to a TextBlock', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Step 1',
      content: '<p>Some HTML content</p>',
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text');
    if (result[0].type === 'text') {
      expect(result[0].content).toBe('<p>Some HTML content</p>');
    }
  });

  it('migrates a codeBlock to a CodeBlock', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Code Step',
      content: '',
      codeBlock: { language: 'bash', code: 'echo hello' },
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('code');
    if (result[0].type === 'code') {
      expect(result[0].language).toBe('bash');
      expect(result[0].code).toBe('echo hello');
    }
  });

  it('migrates an infoBox to a CalloutBlock', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Info Step',
      content: '',
      infoBox: { type: 'warning', title: 'Warning', content: 'Be careful' },
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('callout');
    if (result[0].type === 'callout') {
      expect(result[0].variant).toBe('warning');
      expect(result[0].title).toBe('Warning');
      expect(result[0].content).toBe('Be careful');
    }
  });

  it('migrates grid items to TextBlocks', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Grid Step',
      content: '',
      grid: {
        columns: 2,
        items: [
          { title: 'Col 1', content: '<p>Content 1</p>' },
          { title: 'Col 2', content: '<p>Content 2</p>' },
        ],
      },
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('text');
    expect(result[1].type).toBe('text');
    if (result[0].type === 'text') {
      expect(result[0].content).toContain('Col 1');
      expect(result[0].content).toContain('Content 1');
    }
  });

  it('migrates all legacy fields in order: content → code → infoBox → grid', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Full Step',
      content: '<p>Main content</p>',
      codeBlock: { language: 'js', code: 'console.log("hi")' },
      infoBox: { type: 'info', title: 'Note', content: 'FYI' },
      grid: {
        columns: 2,
        items: [{ title: 'Item', content: 'Grid content' }],
      },
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    expect(result).toHaveLength(4);
    expect(result[0].type).toBe('text');
    expect(result[1].type).toBe('code');
    expect(result[2].type).toBe('callout');
    expect(result[3].type).toBe('text'); // grid item becomes text
  });

  it('generates unique IDs for each block', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Multi Block',
      content: '<p>Text</p>',
      codeBlock: { language: 'py', code: 'print("hi")' },
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    const ids = result.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('ignores whitespace-only content', () => {
    const step: GuideStep = {
      id: 's1',
      title: 'Whitespace Step',
      content: '   \n  \t  ',
      blocks: [],
    };

    const result = migrateStepToBlocks(step);
    expect(result).toHaveLength(0);
  });
});
