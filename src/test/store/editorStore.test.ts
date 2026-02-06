import { beforeEach, describe, expect, it } from 'vitest';
import { useEditorStore } from '../../store/editorStore';
import { act, renderHook } from '@testing-library/react';

describe('editorStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useEditorStore());
    act(() => {
      result.current.setGuide({});
      result.current.setActiveStep(null);
    });
  });

  describe('setGuide', () => {
    it('should set the guide data', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({
          title: 'Test Guide',
          description: 'A test description',
        });
      });

      expect(result.current.guide.title).toBe('Test Guide');
      expect(result.current.guide.description).toBe('A test description');
    });
  });

  describe('setActiveStep', () => {
    it('should set the active step ID', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setActiveStep('step-1');
      });

      expect(result.current.activeStepId).toBe('step-1');
    });

    it('should accept null to clear active step', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setActiveStep('step-1');
        result.current.setActiveStep(null);
      });

      expect(result.current.activeStepId).toBeNull();
    });
  });

  describe('addStep', () => {
    it('should add a new step to the guide', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ title: 'Test', steps: [] });
        result.current.addStep();
      });

      expect(result.current.guide.steps).toHaveLength(1);
      expect(result.current.guide.steps![0]).toHaveProperty('id');
      expect(result.current.guide.steps![0]).toHaveProperty('title');
    });
  });

  describe('removeStep', () => {
    it('should remove a step by ID', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ 
          title: 'Test', 
          steps: [
            { id: 'step-1', title: 'Step 1', content: '', blocks: [] },
            { id: 'step-2', title: 'Step 2', content: '', blocks: [] }
          ] 
        });
        result.current.removeStep('step-1');
      });

      expect(result.current.guide.steps).toHaveLength(1);
      expect(result.current.guide.steps![0].id).toBe('step-2');
    });
  });

  describe('updateStepTitle', () => {
    it('should update a step title', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ 
          title: 'Test', 
          steps: [{ id: 'step-1', title: 'Old Title', content: '', blocks: [] }] 
        });
        result.current.updateStepTitle('step-1', 'New Title');
      });

      expect(result.current.guide.steps![0].title).toBe('New Title');
    });
  });

  describe('addBlock', () => {
    it('should add a block to a step', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ 
          title: 'Test', 
          steps: [{ id: 'step-1', title: 'Step 1', content: '', blocks: [] }] 
        });
        result.current.addBlock('step-1', 'text');
      });

      expect(result.current.guide.steps![0].blocks).toHaveLength(1);
      expect(result.current.guide.steps![0].blocks?.[0]?.type).toBe('text');
    });

    it('should create block with unique ID', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ 
          title: 'Test', 
          steps: [{ id: 'step-1', title: 'Step 1', content: '', blocks: [] }] 
        });
        result.current.addBlock('step-1', 'text');
        result.current.addBlock('step-1', 'code');
      });

      const blocks = result.current.guide.steps![0].blocks;
      expect(blocks?.[0]?.id).not.toBe(blocks?.[1]?.id);
    });
  });

  describe('updateBlock', () => {
    it('should update block properties', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ 
          title: 'Test', 
          steps: [{ 
            id: 'step-1', 
            title: 'Step 1',
            content: '',
            blocks: [{ id: 'block-1', type: 'text', content: 'old' }] 
          }] 
        });
        result.current.updateBlock('step-1', 'block-1', { content: 'new content' });
      });

      const block = result.current.guide.steps![0].blocks?.[0];
      expect((block as any).content).toBe('new content');
    });
  });

  describe('removeBlock', () => {
    it('should remove a block from a step', () => {
      const { result } = renderHook(() => useEditorStore());
      
      act(() => {
        result.current.setGuide({ 
          title: 'Test', 
          steps: [{ 
            id: 'step-1', 
            title: 'Step 1',
            content: '',
            blocks: [
              { id: 'block-1', type: 'text', content: '' },
              { id: 'block-2', type: 'code', language: 'js', code: '' }
            ] 
          }] 
        });
        result.current.removeBlock('step-1', 'block-1');
      });

      expect(result.current.guide.steps![0].blocks).toHaveLength(1);
      expect(result.current.guide.steps![0].blocks?.[0]?.id).toBe('block-2');
    });
  });
});
