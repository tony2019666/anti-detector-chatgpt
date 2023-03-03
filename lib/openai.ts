import { Configuration, OpenAIApi } from "openai";

const apiKey = localStorage.getItem("openaiApiKey") as string;

const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

export default openai;