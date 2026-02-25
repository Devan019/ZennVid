import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../../env_var"

const groq = new Groq({ apiKey:  GROQ_API_KEY});

export { groq };