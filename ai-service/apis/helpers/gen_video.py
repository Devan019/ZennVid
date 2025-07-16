from moviepy import (
    AudioFileClip,
    CompositeVideoClip,
    ImageClip,
    concatenate_videoclips,
    TextClip
)

captions = [
    {
      "index": 1,
      "start": 0,
      "end": 8480,
      "text": "The program is translated on the pro- Antes language screen Enters Program where the scratching of the哲 sister spoke."
    },
    {
      "index": 2,
      "start": 9100,
      "end": 20360,
      "text": "While conducting the program on the other hand, request questions on the Brahmaja Class on the prophecy."
    },
    {
      "index": 3,
      "start": 21100,
      "end": 28900.000000000004,
      "text": "students programme finally decided to prepare for the program after being launched."
    },
    {
      "index": 4,
      "start": 28900,
      "end": 34540,
      "text": "President Maktana Visphot, X- cryptocurrency head"
    },
    {
      "index": 5,
      "start": 34540,
      "end": 39680,
      "text": "Theンド work in an operating environment"
    },
    {
      "index": 6,
      "start": 39680,
      "end": 40820,
      "text": "All that flourigged"
    },
    {
      "index": 7,
      "start": 40820,
      "end": 44120,
      "text": "All that flourigged"
    },
    {
      "index": 8,
      "start": 44120,
      "end": 47340,
      "text": "Theiovногоen sort and naphill"
    },
    {
      "index": 9,
      "start": 47340,
      "end": 52060,
      "text": "Because the price of the currency is cheap"
    }
]

def getVideo(image_filenames, audio_path, subtitles_json):
    audio_clip = AudioFileClip(audio_path)
    total_duration = audio_clip.duration
    
    # Calculate duration per image
    num_images = len(image_filenames)
    image_duration = total_duration / num_images
    image_clips = []

    for filepath in image_filenames:
        clip = ImageClip(filepath).with_duration(image_duration).resized(height=720)
        image_clips.append(clip)

    # Combine image clips into one video
    video = concatenate_videoclips(image_clips, method="compose")

    # Add audio
    audio_clip = AudioFileClip(audio_path)
    video = video.with_audio(audio_clip)

    # Add subtitles from JSON
    subtitle_clips = []
    for item in subtitles_json:
        start = item["start"] / 1000  # convert ms to seconds
        end = item["end"] / 1000
        duration = end - start
        text = item["text"]

        # Create text clip with background for better readability
        txt_clip = (TextClip(
            text=text,
            color='white',
            size=(video.w, None),
            # method='caption',
        )
        .with_duration(duration)
        .with_position(('center', 0.85), relative=True)
        .with_start(start))

        subtitle_clips.append(txt_clip)

    # Combine video and subtitles
    final = CompositeVideoClip([video] + subtitle_clips)

    output_path = "final_video.mp4"
    final.write_videofile(output_path, fps=24)

    return output_path

getVideo(["test-media/p0.png", "test-media/p1.png", "test-media/p2.png", "test-media/p3.png", "test-media/p4.png"], "test-media/audio.mp3", captions)