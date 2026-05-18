import { groq } from "../helpers/groq_client";

const scriptGen = async (title: string, style: string) => {
  try {

    //design prompt
const prompt = `
You are an expert cinematic screenplay writer and AI visual storyteller.

Generate a cinematic short-form video script.

VIDEO DETAILS:
- Title: ${title}
- Style: ${style}
- Language: English
- Total Duration: 30 seconds
- Number of Scenes: EXACTLY 5

SCENE REQUIREMENTS:
Each scene must include:
1. "prompt"
   - Highly detailed cinematic image generation prompt
   - Include environment, lighting, mood, camera angle, colors, atmosphere, subject details
   - Optimized for AI image generation
   - Visually dramatic and realistic

2. "description"
   - Short narration for voiceover
   - Maximum 1-2 short sentences
   - Natural spoken English
   - Emotionally engaging
   - Smooth transition between scenes

STORY RULES:
- All 5 scenes must connect into ONE coherent story
- Story should feel cinematic and emotionally immersive
- Keep narration concise enough for a 30-second voiceover
- Avoid repetition
- Maintain visual continuity between scenes
- Focus on cinematic pacing and storytelling

Output format: 
{
 "scenes": [ 
  { "prompt": "...", "description": "..." }, 
  { "prompt": "...", "description": "..." },
  { "prompt": "...", "description": "..." }, 
  { "prompt": "...", "description": "..." },
  { "prompt": "...", "description": "..." }, 
 ] 
}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- Ensure JSON is parsable
- Make a easy and understandable story that fits the title and style, not making it too complex
- use simple language for the narration, avoid using complex words or phrases
`;

    //call llm
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b"
    });


    const res = response.choices[0].message?.content?.replace(/\\n/g, "\n") ?? "";

    //parse response
    const script = JSON.parse(res);
    return script;

  } catch (error) {
    console.log("Script generation error:", error);
    return null;
  }
}

// //demo
// scriptGen("A law can change life of human - in positive way", "Anime").then(script => {
//   console.log("Generated script:",script);
// }).catch(err => {
//   console.log("Script generation error:", err);
// });

export { scriptGen };