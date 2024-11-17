import { useCallback } from 'react';

const SOUNDS = {
  start: 'https://cdn.pixabay.com/audio/2022/03/25/audio_c8c8a73acc.mp3',
  change: 'https://cdn.pixabay.com/audio/2023/07/09/audio_d3c3664ddf.mp3',
  complete: 'https://cdn.pixabay.com/audio/2022/03/19/audio_d3c3664ddf.mp3',
  countdown: 'https://cdn.pixabay.com/audio/2022/03/25/audio_31a5f8a881.mp3'
} as const;

export function useSound() {
  const playSound = useCallback(async (type: keyof typeof SOUNDS) => {
    try {
      const audio = new Audio(SOUNDS[type]);
      audio.volume = 0.7;
      await audio.play();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }, []);

  return { playSound };
}