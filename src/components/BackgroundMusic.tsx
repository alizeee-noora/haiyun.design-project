"use client";
import { useEffect, useRef } from "react";

interface BackgroundMusicProps {
  playing: boolean;
}

export function BackgroundMusic({ playing }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    if (playing) {
      audio.muted = false;
      audio.play().catch(() => {
        audio.muted = true;
        audio.play().catch(() => {});
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  return (
    <audio
      ref={audioRef}
      src="/audio/dreamin.mp3"
      loop
      preload="auto"
      muted
      style={{ display: "none" }}
    />
  );
}
