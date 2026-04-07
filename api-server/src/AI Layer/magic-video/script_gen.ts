import { groq } from "../helpers/groq_client";

const scriptGen = async (title: string, style: string, seconds: number, language: string) => {
  try {

    //calculate words
    let words = 30;

    //design prompt
    const prompt = `
Generate a short cinematic video script.

Title: ${title}
Style: ${style}
Language: English
Duration: ${seconds} seconds

Instructions:
- Divide the story into EXACTLY 5 scenes
- Each scene must contain:
  - "prompt": a highly detailed cinematic image generation prompt
  - "description": short narration (1-2 sentences)

- Keep total narration length suitable for ${seconds} seconds
- Make the story engaging, emotional, and visually rich

Output format:
{
  "scenes": [
    { "prompt": "...", "description": "..." },
    { "prompt": "...", "description": "..." },
    { "prompt": "...", "description": "..." },
    { "prompt": "...", "description": "..." },
    { "prompt": "...", "description": "..." }
  ]
}

Rules:
- Return ONLY valid JSON
- No markdown
- No extra text
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

export { scriptGen };