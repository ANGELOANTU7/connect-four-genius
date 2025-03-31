
// Sound effect types
export type SoundEffect = 'drop' | 'win' | 'click' | 'draw';

// Audio context and sounds cache
let audioContext: AudioContext | null = null;
const soundsCache: Record<string, AudioBuffer> = {};

// Sound URLs
const SOUND_URLS: Record<SoundEffect, string> = {
  drop: 'https://assets.mixkit.co/active_storage/sfx/1351/1351-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  draw: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3',
};

// Initialize the audio context (must be called on user interaction)
export const initAudio = (): void => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Preload all sounds
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        fetchSound(url as SoundEffect);
      });
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
    }
  }
};

// Fetch and cache a sound
const fetchSound = async (type: SoundEffect): Promise<AudioBuffer | null> => {
  if (!audioContext) return null;
  
  // Return from cache if already loaded
  if (soundsCache[type]) {
    return soundsCache[type];
  }
  
  try {
    const response = await fetch(SOUND_URLS[type]);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundsCache[type] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error(`Error loading sound ${type}:`, error);
    return null;
  }
};

// Play a sound effect
export const playSound = async (type: SoundEffect): Promise<void> => {
  if (!audioContext) {
    initAudio();
    if (!audioContext) return;
  }
  
  try {
    // Fetch the sound if not cached
    const soundBuffer = await fetchSound(type);
    if (!soundBuffer || !audioContext) return;
    
    // Create source and play
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error(`Error playing sound ${type}:`, error);
  }
};

// Toggle mute status
let muted = false;

export const toggleMute = (): boolean => {
  muted = !muted;
  return muted;
};

export const isMuted = (): boolean => {
  return muted;
};

// Play sound if not muted
export const playSoundIfEnabled = (type: SoundEffect): void => {
  if (!muted) {
    playSound(type);
  }
};
