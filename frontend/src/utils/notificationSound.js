// Modern Web Audio API Chime & Desktop Notification Utility

export function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Ensure AudioContext is running (in case browser suspended it)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2: A5 (880 Hz) - crisp harmonic double-ding
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.14);
    gain2.gain.setValueAtTime(0.15, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.65);
  } catch (e) {
    // Audio may be blocked until user interacts with the page
  }
}

export function requestBrowserNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }
}

export function triggerDesktopNotification(title, options = {}) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body: options.body || 'Your video analysis is complete!',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: options.tag || 'qualitylens-analysis',
          ...options
        });

        notif.onclick = () => {
          window.focus();
          if (options.onClick) {
            options.onClick();
          }
          notif.close();
        };

        // Auto close desktop banner after 8s
        setTimeout(() => notif.close(), 8000);
      } catch (err) {
        console.warn('Desktop notification error:', err);
      }
    }
  }
}
