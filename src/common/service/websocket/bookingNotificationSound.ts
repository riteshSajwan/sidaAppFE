let audioInstance: HTMLAudioElement | null = null;

export const playBookingNotificationSound = () => {
  try {
    if (typeof window === 'undefined') return;

    // Reuse the same Audio instance to avoid creating multiple elements
    if (!audioInstance) {
      audioInstance = new window.Audio('/Notification.mp3');
      audioInstance.volume = 1.0;
    }

    // Rewind and play — handles rapid successive calls cleanly
    audioInstance.currentTime = 0;
    audioInstance.play().catch(() => {
      // Autoplay may be blocked until user interacts with the page — silent fail is fine
    });
  } catch {
    // Keep notifications working even when sound fails
  }
};
