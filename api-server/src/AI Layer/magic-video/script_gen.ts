import { groq } from "../helpers/groq_client";

const scriptGen = async(title: string, style: string, seconds: number, language: string) => {
  try {

    //calculate words
    let words = 25;
    if (language.toLowerCase() === "english") {
      words = 30;
    }

    //design prompt
    const prompt = `Generate a short story video script titled '${title}' in '${style}' style.
        Break it into exactly 1 visual scenes. Each scene must be a JSON object with:\n
        - 'prompt': a detailed image generation prompt (string)\n
        - 'description': a vivid short narration (string)\n
        Assume ${words} words per second.\n

        Make consice descriptions that fit the total video length of ${seconds} seconds. The total speaking time for all descriptions must be close to ${seconds} seconds without exceeding it.\n\n

        story must be engaging and suitable for a short video format. The visual scene should be rich in detail to inspire compelling image generation.

        Make short and sweet descriptions that fit the total video length of ${seconds} seconds. The total speaking time for all descriptions must be close to ${seconds} seconds without exceeding it.\n\n

         **IMPORTANT: Return ONLY a valid JSON array of exactly 1 objects. No explanation, no markdown.**\n\n`

    //call llm
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    response.choices[0].message.content = response.choices[0].message.content?.replace(/\\n/g, "\n") ?? "";

    //parse response
    const script = JSON.parse(response.choices[0].message.content);
    return script;

  } catch (error) {
    console.log("Script generation error:", error);
    return null;
  }
}

export { scriptGen };