import { OpenAI } from "openai";
import { NEBIUS_API_KEY, NEBIUS_API_URL } from "../../env_var";
const nebius = new OpenAI({
    baseURL: NEBIUS_API_URL,
    apiKey: NEBIUS_API_KEY,
});

export { nebius };  