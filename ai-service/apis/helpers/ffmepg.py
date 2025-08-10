import subprocess
import os
import uuid
import cloudinary
import cloudinary.uploader
from typing import List, Dict
import json
from dotenv import load_dotenv
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)
def create_video(
    captions_json: str,
    images: List[str],
    audio: str,
    output_filename: str = "output_video.mp4"
) -> str:
    """
    Create a video with captions from images and audio, upload to Cloudinary, and clean up local files.
    
    Args:
        captions_json: JSON string of captions data
        images: List of image file paths
        audio: Audio file path
        cloudinary_config: Dict with Cloudinary config (cloud_name, api_key, api_secret)
        output_filename: Name for the output video file
        
    Returns:
        Cloudinary URL of the uploaded video
    """
    # Initialize Cloudinary
    
    # Parse captions JSON
    try:
        captions = json.loads(captions_json)
        if not isinstance(captions, list):
            raise ValueError("Captions JSON should be an array of objects")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid captions JSON: {str(e)}")
    
    # Validate files exist
    for img in images:
        if not os.path.exists(img):
            raise FileNotFoundError(f"Image file not found: {img}")
    if not os.path.exists(audio):
        raise FileNotFoundError(f"Audio file not found: {audio}")
    
    # --- Create SRT file ---
    def create_srt(captions_data, srt_path):
        def ms_to_srt_time(ms):
            total_sec = ms / 1000
            h = int(total_sec // 3600)
            m = int((total_sec % 3600) // 60)
            s = int(total_sec % 60)
            ms_remainder = int((total_sec - int(total_sec)) * 1000)
            return f"{h:02}:{m:02}:{s:02},{ms_remainder:03}"

        with open(srt_path, "w", encoding="utf-8") as f:
            for c in captions_data:
                f.write(f"{c['index']}\n")
                f.write(f"{ms_to_srt_time(c['start'])} --> {ms_to_srt_time(c['end'])}\n")
                f.write(f"{c['text']}\n\n")

    srt_file = "temp_captions.srt"
    create_srt(captions, srt_file)
    
    # --- Video Creation Parameters ---
    width, height = 1280, 720
    fps = 30
    total_duration_ms = captions[-1]['end']
    total_duration_sec = total_duration_ms / 1000
    image_durations = [total_duration_sec / len(images)] * len(images)
    
    # --- Build FFmpeg Command ---
    ffmpeg_cmd = ["ffmpeg", "-y"]
    
    # Add image inputs
    for img, duration in zip(images, image_durations):
        ffmpeg_cmd += ["-loop", "1", "-t", str(duration), "-i", img]
    
    # Add audio input
    ffmpeg_cmd += ["-i", audio]
    
    # Construct filter_complex
    filter_parts = []
    for i in range(len(images)):
        # Smooth zoom effect centered on image
        zoom_expr = (
            f"zoom=1+0.05*sin(2*PI*on/({fps}*{image_durations[i]})):"
            f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        )
        filter_parts.append(
            f"[{i}:v]scale={width}:{height},zoompan={zoom_expr}:fps={fps}:d={image_durations[i] * fps}[v{i}]"
        )
    
    # Chain xfade between videos
    xfade_duration = 1  # 1 sec crossfade
    current = "[v0]"
    for i in range(1, len(images)):
        next_vid = f"[v{i}]"
        output_label = f"[vx{i}]"
        offset = sum(image_durations[:i]) - xfade_duration * (i-1)
        filter_parts.append(
            f"{current}{next_vid}xfade=transition=fade:duration={xfade_duration}:offset={offset}{output_label}"
        )
        current = output_label
    
    # Add subtitles
    sub_filter = (
        f"{current}subtitles={srt_file}:force_style='FontName=Arial,FontSize=22,"
        "PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,Outline=2,Shadow=1,Alignment=2'"
        "[v]"
    )
    filter_parts.append(sub_filter)
    
    # Complete FFmpeg command
    ffmpeg_cmd += [
        "-filter_complex", ";".join(filter_parts),
        "-map", "[v]",
        "-map", f"{len(images)}:a",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-r", str(fps),
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_filename
    ]
    
    # Run FFmpeg
    print("Creating video...")
    try:
        subprocess.run(ffmpeg_cmd, check=True)
        print("Video created successfully")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"FFmpeg failed with error: {str(e)}")
    
    import uuid

    # Generate unique name using UUID
    unique_id = str(uuid.uuid4())
    public_id = f"zennvid/{unique_id}"  # Cloudinary folder + unique name

    # Upload to Cloudinary
    print("Uploading to Cloudinary...")
    try:
        upload_result = cloudinary.uploader.upload(
            output_filename,
            resource_type="video",
            public_id=public_id
        )
        video_url = upload_result['secure_url']
        print("Upload successful")
    except Exception as e:
        raise RuntimeError(f"Cloudinary upload failed: {str(e)}")
    
    # Clean up local files
    print("Cleaning up temporary files...")
    cleanup_files = images + [audio, srt_file, output_filename]
    for file_path in cleanup_files:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Warning: Could not delete {file_path}: {str(e)}")
    
    return video_url

