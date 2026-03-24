const GOD_MODE_CODE = "stoxpilot-god-2024";

export function enableGodMode(code: string): boolean {
  if (code === GOD_MODE_CODE) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('godMode', 'true');
    }
    return true;
  }
  return false;
}

export function isGodMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('godMode') === 'true';
}

export function disableGodMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('godMode');
  }
}
