import fs from "fs/promises";
import { CLOUDFLARE_WORKER_KEY, CLOUDFLARE_WORKER_URL,  } from "../../env_var";

const imageGen = async ({
  prompt,
  filePath,
  Location,
}: {
  prompt: string;
  filePath: string;
  Location?: string;
}) => {
  try {
    console.time("Image generation time");
    // call cloudflare worker
    const res = await fetch(CLOUDFLARE_WORKER_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_WORKER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    console.timeEnd("Image generation time");
    if (!res.ok) {
      throw new Error("Failed to generate image");
    }
    console.time("Image upload time");

    // blob -> buffer 
    const buffer = Buffer.from(await res.arrayBuffer());

    // save to local disk
    await fs.writeFile(filePath, buffer);
    //save image to local disk
    
    console.timeEnd("Image upload time");
    return {
      Key: "LOCAL",
      Location,
    };

  } catch (error) {
    console.log("Image generation error:", error);
    return {
      Key: "",
      Location: "",
    };
  }
};

// //to test the function
// const demo = async () => {

//   const dir = path.join(process.cwd(), "public", "magic-studio", "demo_user", "demo_job");
//   await fs.mkdir(dir, { recursive: true });

//   imageGen({
//     prompt: "Close-up portrait of a young woman inside a spaceship cockpit, soft cinematic lighting, reflections from control panels on her face, emotional expression, ultra detailed eyes, realistic skin texture, sci-fi atmosphere, dramatic shadows, shallow depth of field, cinematic photography, vertical framing, 9:16",
//     filePath: path.join(dir, "test_image.jpg"),
//     imageType: "image/jpg"
//   }).then((res) => {
//     console.log(res);
//   })
//     .catch((err) => {
//       console.log("Error in image generation:", err);
//     });
// }
// demo();
// //demo to gen 5 image one by one
// const data = [
//   {
//     "prompt": "A neon-soaked alley in a rain‑slick city, low angle, cinematic framing, the young woman with a battered umbrella stands alone under a flickering streetlamp. The environment is drenched with reflective puddles, mist curling around the cobblestones, neon signs glowing in muted blues and purples. The mood is melancholy yet hopeful, with sharp rain droplets sparkling like tiny crystals. Camera focus on her face, wet eyes, slight smile breaking through the gloom, lighting from the streetlamp giving an orange rim around her silhouette. The scene is rendered in detailed anime style with realistic textures, high contrast, and subtle motion blur to simulate rain. ",
//     "description": "Rain fell over the city, but hope was just a shadow away."
//   },
//   {
//     "prompt": "A large billboard in the same alley, now illuminated, shows bold blue text proclaiming a \"New Transportation Subsidy Law Effective Immediately.\" The billboard casts a bright glow that pierces the rainy haze, contrasting with the dark alley. The woman lifts her head, eyes widening as the light hits her face, turning the scene from bleak to hopeful. The lighting is dramatic, with the billboard’s light creating a halo effect, soft shadows around her. The environment remains the rain‑slick city, but the color palette shifts to include electric blue and crisp white from the billboard. The anime style emphasizes dynamic lighting and clear facial expressions, capturing the moment of realization. ",
//     "description": "A bright billboard announced a new law that would change everything."
//   },
//   {
//     "prompt": "Inside a modern bus, bright interior lights cast a warm golden glow on polished stainless steel seats. The woman steps aboard, holding a ticket sticker that reads \"Free for Low Income\". The camera pulls back to a low angle inside, showing the city blur outside the windows. The scene is cinematic, with soft focus on the ticket, a slight motion blur as the bus accelerates, and a sense of upward motion. The lighting is warm, contrasting the cooler exterior, with subtle reflections on the windshield. The anime rendering captures the bustling interior, clear facial expression of relief, and crisp details on the ticket. ",
//     "description": "With a ticket in hand, she boarded a bus that would carry her dreams."
//   },
//   {
//     "prompt": "A sunny park in spring, cherry blossoms falling, a kind older woman in a simple dress guides the young woman through a study group. The setting is soft, warm sunlight filtering through the branches, creating dappled patterns on the ground. The mood is nurturing, supportive, with gentle smiles exchanged. Camera is eye level, slightly wide to capture both characters, focusing on the mentor’s encouraging gestures. The color palette includes pastel pinks, greens, and warm browns, enhancing the comforting atmosphere. Anime style highlights the gentle lighting, realistic skin textures, and expressive faces. ",
//     "description": "Guided by a mentor, she found the path she had been missing."
//   },
//   {
//     "prompt": "A graduation ceremony under a clear blue sky, confetti floating in the air, the young woman in a traditional cap and gown standing on a stage with a microphone. The camera pulls back to a wide shot, capturing the crowd cheering, banners fluttering. The lighting is bright, natural sunlight with a golden hue, emphasizing the celebratory mood. The environment is a campus courtyard, with trees and a distant city skyline. The anime rendering captures the dynamic movement of confetti, the glow of stage lights, and the proud expression on the graduate’s face. ",
//     "description": "Standing under the sun, she realized a law could light a whole life."
//   }
// ]

// async function genMultipleImages() {
//   for (const item of data) {
//     const { prompt } = item;
//     const res = await imageGen(prompt);
//     console.log("image ", res);
//   }
// }

// genMultipleImages();

export { imageGen };