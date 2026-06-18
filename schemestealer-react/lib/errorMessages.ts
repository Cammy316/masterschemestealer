/**
 * Centralised scan-error mapping.
 *
 * Turns any thrown error into a structured, user-facing message: a Warhammer 40K
 * voiced headline plus a plain-English, actionable line. Classification is driven
 * by ApiError status / error name only — never by string-matching the message
 * (brittle, and it leaks dev detail like hostnames). The dominant failure mode on
 * the free Render tier is a cold start (30–60s), surfaced as a retryable,
 * cold-start-flavoured error so the UI can prompt a simple retry.
 */
import { ApiError } from './apiClient';
import type { ScanMode } from './types';

export interface ScanError {
  flavour: string; // 40K-voiced headline
  plain: string; // actionable plain English
  retryable: boolean;
  likelyColdStart: boolean;
}

const COLD_START_PLAIN =
  'The server is waking up — this takes about 30 seconds. Try again shortly.';

function coldStart(mode: ScanMode): ScanError {
  return {
    flavour:
      mode === 'miniature'
        ? 'VOX CONNECTION DISRUPTED — the cogitator mainframe is rousing from dormancy.'
        : 'WARP INTERFERENCE DETECTED — the Astronomican is obscured.',
    plain: COLD_START_PLAIN,
    retryable: true,
    likelyColdStart: true,
  };
}

function generic(mode: ScanMode): ScanError {
  return {
    flavour:
      mode === 'miniature'
        ? 'COGITATOR FAULT — the machine spirit is displeased.'
        : 'WARP ANOMALY — the ritual faltered.',
    plain: 'Something went wrong processing the scan. Please try again.',
    retryable: true,
    likelyColdStart: false,
  };
}

export function mapScanError(err: unknown, mode: ScanMode): ScanError {
  const isMini = mode === 'miniature';

  // Defensive: a raw abort (apiClient normally normalises this to ApiError 408).
  if (err instanceof Error && err.name === 'AbortError') {
    return coldStart(mode);
  }

  if (err instanceof ApiError) {
    // Timeout (408) and network failure (no status — fetch could not reach the
    // server) both mean the backend is unreachable: overwhelmingly a cold start.
    if (err.status === 408 || err.status === undefined) {
      return coldStart(mode);
    }
    if (err.status === 429) {
      return {
        flavour: isMini
          ? 'AUSPEX OVERLOAD — too many requests in quick succession.'
          : 'THE WARP CHURNS — too many offerings, too quickly.',
        plain: 'Too many scans in a short time — wait a minute and retry.',
        retryable: true,
        likelyColdStart: false,
      };
    }
    if (err.status === 413) {
      return {
        flavour: isMini
          ? 'PICT-FILE TOO VAST — the cogitator cannot ingest it.'
          : 'OFFERING TOO GREAT — the Warp cannot receive it.',
        plain: 'That image is too large. Try a smaller photo.',
        retryable: false,
        likelyColdStart: false,
      };
    }
    // 500 and any other server-side status.
    return generic(mode);
  }

  // Unknown / non-API error.
  return generic(mode);
}
