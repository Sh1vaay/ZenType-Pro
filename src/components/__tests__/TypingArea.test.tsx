import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TypingArea from '../TypingArea';
import { StageType, SessionSettings, TestMode } from '../../types';

// Mock sound engine
vi.mock('../../services/soundEngine', () => ({
  playKeySound: vi.fn(),
}));

const mockSettings: SessionSettings = {
  includePunctuation: false,
  includeNumbers: false,
  mode: 'CLASSIC' as TestMode,
  duration: 60,
  wordCount: 25,
  caretStyle: 'line',
  caretAnimation: 'smooth',
  soundPack: 'none',
  theme: 'dark',
  keyboardTheme: 'default',
  layout: 'qwerty',
  showGhost: false,
  fontFamily: 'sans',
  density: 'comfortable',
  flipColors: false,
  blurEffect: false,
  keymapMode: 'off',
  ghostWpm: 0,
  metronomeBpm: 0,
  metronomeOn: false,
  showHandGuide: false,
  juiceLevel: 'none',
};

describe('TypingArea', () => {
  const onFinish = vi.fn();
  const onRestart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text correctly', () => {
    render(
      <TypingArea
        text="hello"
        stage={StageType.SINGLE_LETTER}
        settings={mockSettings}
        isActive={true}
        onFinish={onFinish}
        onRestart={onRestart}
      />
    );
    expect(screen.getByText('h')).toBeInTheDocument();
  });

  it('handles user typing and triggers onFinish when complete', async () => {
    const user = userEvent.setup();
    render(
      <TypingArea
        text="hi"
        stage={StageType.SINGLE_LETTER}
        settings={mockSettings}
        isActive={true}
        onFinish={onFinish}
        onRestart={onRestart}
      />
    );

    // Type the correct characters
    await user.keyboard('hi');

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    });
    
    // Check that stats object is passed to onFinish
    const stats = onFinish.mock.calls[0][0];
    expect(stats.accuracy).toBe(100);
    expect(stats.mistakes).toBe(0);
  });
});
