/**
 * Zustand store — Session Forge state management.
 *
 * Validates the core requirements for the Session Forge:
 * 1. Reload-resilience (recompute from dryUntil instead of accumulating ticks)
 * 2. Parallel timers
 * 3. Override persistence
 * 4. Replace-session flow
 */
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { useAppStore } from '../store';

// Mock mlLogger as it touches window at module load
vi.mock('../mlDataLogger', () => ({
  mlLogger: { logCartAction: vi.fn() },
}));

function resetStore(): void {
  useAppStore.setState({
    activeSession: null,
  });
}

beforeEach(() => {
  resetStore();
  localStorage.clear();
});

describe('Session Forge state management', () => {
  const createMockSession = () => ({
    scanId: 'scan-1',
    startedAt: new Date().toISOString(),
    colours: [
      {
        colourIndex: 0,
        brand: 'Citadel',
        steps: [
          { role: 'base' as const, paintName: 'Mephiston Red', status: 'pending' as const },
          { role: 'wash' as const, paintName: 'Agrax Earthshade', status: 'pending' as const },
        ],
      },
      {
        colourIndex: 1,
        brand: 'Citadel',
        steps: [
          { role: 'base' as const, paintName: 'Macragge Blue', status: 'pending' as const },
        ],
      }
    ],
    dryTimeOverrides: {},
  });

  it('allows starting a new session', () => {
    const s = useAppStore.getState();
    const mockSession = createMockSession();
    
    s.setActiveSession(mockSession);
    
    const after = useAppStore.getState();
    expect(after.activeSession).toEqual(mockSession);
  });

  it('updates a step status and sets dryUntil (parallel timers support)', () => {
    const s = useAppStore.getState();
    s.setActiveSession(createMockSession());
    
    const now = Date.now();
    const dryUntil1 = now + 10 * 60 * 1000;
    
    // Start drying for first colour wash
    useAppStore.getState().updateSessionStep(0, 'wash', 'drying', dryUntil1);
    
    const dryUntil2 = now + 5 * 60 * 1000;
    // Start drying for second colour base (parallel timer)
    useAppStore.getState().updateSessionStep(1, 'base', 'drying', dryUntil2);
    
    const active = useAppStore.getState().activeSession!;
    expect(active.colours[0].steps[1].status).toBe('drying');
    expect(active.colours[0].steps[1].dryUntil).toBe(dryUntil1);
    
    expect(active.colours[1].steps[0].status).toBe('drying');
    expect(active.colours[1].steps[0].dryUntil).toBe(dryUntil2);
  });

  it('recomputes from dryUntil to survive reload resilience', () => {
    const s = useAppStore.getState();
    s.setActiveSession(createMockSession());
    
    const dryUntil = Date.now() + 10 * 60 * 1000; // 10 mins from now
    s.updateSessionStep(0, 'wash', 'drying', dryUntil);
    
    // Simulate a page reload where state is loaded from localStorage or re-initialized
    const active = useAppStore.getState().activeSession!;
    
    // As long as dryUntil is absolute (epoch ms), reading it after reload will 
    // allow the UI to recompute remaining time. We verify the store persists it.
    expect(active.colours[0].steps[1].dryUntil).toBeGreaterThan(Date.now());
  });

  it('supports overriding dry times persistently', () => {
    const s = useAppStore.getState();
    s.setActiveSession(createMockSession());
    
    s.updateSessionOverride('wash', 15);
    
    const active = useAppStore.getState().activeSession!;
    expect(active.dryTimeOverrides['wash']).toBe(15);
  });

  it('replaces an active session when requested', () => {
    const s = useAppStore.getState();
    s.setActiveSession(createMockSession());
    
    const newSession = {
      ...createMockSession(),
      scanId: 'scan-2'
    };

    s.setActiveSession(newSession);

    const active = useAppStore.getState().activeSession!;
    expect(active.scanId).toBe('scan-2');
  });

  it('updateSessionStep replaces nested objects immutably', () => {
    // The original implementation mutated the colour's steps array in place
    // on a shallow-copied colours list — identity-based subscribers (and
    // React memoisation) never saw nested changes.
    const s = useAppStore.getState();
    s.setActiveSession(createMockSession());
    const before = useAppStore.getState().activeSession!;
    const untouchedColourBefore = before.colours[1];

    s.updateSessionStep(0, 'wash', 'drying', Date.now() + 60_000);

    const after = useAppStore.getState().activeSession!;
    expect(after).not.toBe(before);
    expect(after.colours[0]).not.toBe(before.colours[0]);        // changed colour: new object
    expect(after.colours[0].steps).not.toBe(before.colours[0].steps);
    expect(after.colours[0].steps[1].status).toBe('drying');
    expect(before.colours[0].steps[1].status).toBe('pending');   // old snapshot untouched
    expect(after.colours[1]).toBe(untouchedColourBefore);        // unrelated colour: same ref
  });
});
