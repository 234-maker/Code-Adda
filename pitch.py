import librosa
import soundfile as sf
import matplotlib.pyplot as plt
import sounddevice as sd
import time

# ---- USER INPUT ----
audio_path = "pitch.mp3"   # Change to your file name
pitch_steps_high = 6
pitch_steps_low = -6
# ---------------------

print("Loading audio...")
audio, sr = librosa.load(audio_path)

# Pitch shift
print("Processing high pitch...")
high_pitch = librosa.effects.pitch_shift(y=audio, sr=sr, n_steps=pitch_steps_high)

print("Processing low pitch...")
low_pitch = librosa.effects.pitch_shift(y=audio, sr=sr, n_steps=pitch_steps_low)

# Save audio
sf.write("high_pitch.wav", high_pitch, sr)
sf.write("low_pitch.wav", low_pitch, sr)

print("\nFiles Created:")
print("✔ high_pitch.wav")
print("✔ low_pitch.wav")

# Play original audio
print("\n▶ Playing Original Audio...")
sd.play(audio, sr)
sd.wait()

# Play high pitch
print("\n▶ Playing High Pitch Audio...")
sd.play(high_pitch, sr)
sd.wait()

# Play low pitch
print("\n▶ Playing Low Pitch Audio...")
sd.play(low_pitch, sr)
sd.wait()

# Plot waveform
plt.figure(figsize=(12, 6))

plt.subplot(3, 1, 1)
plt.plot(audio)
plt.title("Original Audio Waveform")

plt.subplot(3, 1, 2)
plt.plot(high_pitch)
plt.title("High Pitch Audio Waveform")

plt.subplot(3, 1, 3)
plt.plot(low_pitch)
plt.title("Low Pitch Audio Waveform")

plt.tight_layout()
plt.show()
