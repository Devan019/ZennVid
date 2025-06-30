import subprocess

def generate_video(audio_path):
    video_path = "media/video/final_video.mp4"
    # Create a simple black background video with audio
    subprocess.run([
        "ffmpeg", "-f", "lavfi", "-i", "color=c=black:s=1280x720:d=5",
        "-i", audio_path,
        "-shortest", "-c:v", "libx264", "-c:a", "aac",
        video_path, "-y"
    ])

def generate_srt(text, output_path):
    lines = text.strip().split(". ")
    with open(output_path, "w", encoding="utf-8") as f:
        for i, line in enumerate(lines, start=1):
            start = f"00:00:{i:02},000"
            end = f"00:00:{i+1:02},000"
            f.write(f"{i}\n{start} --> {end}\n{line.strip()}\n\n")

def add_subtitles(video_path, srt_path, output_path):
    try:
        subprocess.run([
            "ffmpeg", "-i", video_path,
            "-vf", f"subtitles={srt_path}",
            "-c:a", "copy",
            output_path,
            "-y"
        ], check=True)
        return True
    except subprocess.CalledProcessError:
        return False


def format_timestamp(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"