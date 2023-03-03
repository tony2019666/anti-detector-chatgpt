import { Configuration, OpenAIApi } from "openai";

const apiKey = localStorage.getItem("openaiApiKey") as string;
console.log("API KEY", apiKey);

const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

export default openai;