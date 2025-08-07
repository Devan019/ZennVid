
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";

interface Captaion {
  index: number;
  start: number;
  end: number;
  text: string;
}

const Videomotion = ({ audioUrl, images, captions }: {
  audioUrl: string;
  images: string[];
  captions: Captaion[];
}) => {

  //dummyy data
  const durationInFrames = Math.ceil(captions[captions.length - 1].end / (1000 / 30));

  return (
    <div className="">
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
          captions,
          width: 350,
          height: 500,
        }}
        className="border-black rounded-lg"
      />
    </div>
  )
}

export default Videomotion