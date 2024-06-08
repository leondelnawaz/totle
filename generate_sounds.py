from pydub import AudioSegment
from pydub.generators import Sine
import os

# Set the path to FFmpeg
ffmpeg_path = "D:\\Users\\Leon\\Downloads\\ffmpeg-7.0.1-essentials_build\\ffmpeg-7.0.1-essentials_build\\bin\\ffmpeg.exe"
if not os.path.exists(ffmpeg_path):
    raise FileNotFoundError(f"FFmpeg not found at {ffmpeg_path}")

AudioSegment.converter = ffmpeg_path

def generate_correct_sound(file_path):
    # Generate a high-pitched "ding" sound
    ding = Sine(1500).to_audio_segment(duration=300).fade_out(100)
    ding.export(file_path, format="mp3")

def generate_incorrect_sound(file_path):
    # Generate a single-tone buzzer sound
    buzzer = Sine(200).to_audio_segment(duration=500).fade_in(50).fade_out(50)
    buzzer.export(file_path, format="mp3")

if __name__ == "__main__":
    generate_correct_sound("correct.mp3")
    generate_incorrect_sound("incorrect.mp3")
