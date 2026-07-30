// A template's timing contract. `factory qa` verifies the hook lands within 3 s, that
// every named beat sits inside the composition, and (loopCloses) that the last frame
// matches the first.
export interface Beat {
  name: string;
  frame: number;
}

export interface TemplateManifest {
  id: 't1' | 't2' | 't3';
  label: string;
  durationInFrames: number;
  fps: number;
  hookEndFrame: number; // hook must be fully established by here (≤ 3 s)
  loopCloses: boolean;
  beats: Beat[];
}
