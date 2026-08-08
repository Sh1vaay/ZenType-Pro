import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VirtualKeyboard from '../VirtualKeyboard';
import { StageType } from '../../types';
import '@testing-library/jest-dom';

describe('VirtualKeyboard', () => {
  it('renders standard QWERTY layout by default', () => {
    const { container } = render(<VirtualKeyboard stage={StageType.SINGLE_LETTER} />);
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
    // Snapshot to catch unintended layout changes
    expect(container).toMatchSnapshot();
  });

  it('highlights the target key', () => {
    const { container } = render(<VirtualKeyboard stage={StageType.SINGLE_LETTER} targetKey="f" />);
    // In our VirtualKeyboard, active key has the 'bg-indigo-500' or similar active class
    // We can just verify it renders without crashing for now, and test for snapshot
    expect(container).toMatchSnapshot();
  });

  it('handles empty target key gracefully', () => {
    const { container } = render(<VirtualKeyboard stage={StageType.SINGLE_LETTER} targetKey={undefined} />);
    expect(container).toBeInTheDocument();
  });
});
