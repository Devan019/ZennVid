
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
const Videomotion = () => {

  //dummyy data
  const audioUrl = "/audio.mp3";
  const durationInFrames = Math.ceil(38880 / (1000 / 30));
  const images = ["/gemini-images/p0.png", "/gemini-images/p1.png", "/gemini-images/p2.png", "/gemini-images/p3.png", "/gemini-images/p4.png"];
  const capations = [
    {
      "index": 1,
      "start": 0,
      "end": 5680,
      "text": "The Sky Pirates Airship, Mavericks Revenge, approaches the majestic floating cities."
    },
    {
      "index": 2,
      "start": 5680,
      "end": 11520,
      "text": "The airship docks at the floating city of Nova Haven, a hub of intercity commas and innovation."
    },
    {
      "index": 3,
      "start": 11520,
      "end": 15760,
      "text": "Captain Jackson Jackson of the Mavericks Revenge meets with Commissioner Ortega to discuss a"
    },
    {
      "index": 4,
      "start": 15760,
      "end": 21040,
      "text": "lucrative smuggling deal, a high-tech control room with holographic displays and future estate"
    },
    {
      "index": 5,
      "start": 21040,
      "end": 26720,
      "text": "consoles, where Commissioner Ortega reveals a holographic map of the floating cities and a secret"
    },
    {
      "index": 6,
      "start": 26720,
      "end": 28880,
      "text": "underground network dot the Sky Pirates."
    },
    {
      "index": 7,
      "start": 30000,
      "end": 34480.00000000001,
      "text": "Airship flying through a narrow, neon-lit tunnel beneath the floating cities,"
    },
    {
      "index": 8,
      "start": 34480.00000000001,
      "end": 38880,
      "text": "with the ship's engine's glowing bright blue as it picks up speed."
    }
  ]

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Player
        component={RemotionVideo}
        durationInFrames={durationInFrames}
        compositionWidth={350}
        compositionHeight={500}
        fps={30}
        controls
        inputProps={{
          audioUrl,
          images,
          capations,
          width: 350,
          height: 500,
        }}
        className="border-black rounded-lg"
      />
    </div>
  )
}

export default Videomotion