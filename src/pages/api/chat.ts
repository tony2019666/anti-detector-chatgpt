import {NextApiRequest} from "next";
import {Configuration, OpenAIApi} from "openai";


// @ts-ignore
const ask = async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const {
                prompt,
                apiKey,
            } = req.body as {
                prompt: string,
                apiKey: string
            }

            const configuration = new Configuration({
                apiKey: apiKey,
            });
            const openai = new OpenAIApi(configuration);

            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `${prompt}`,
                    }],
                max_tokens: 2000,
                temperature: 1.7, // Higher values means the model will take more risks.
                top_p: 0.95, // alternative to sampling with temperature, called nucleus sampling
                frequency_penalty: 2.0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
                presence_penalty: 0.0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
            });

            res.status(200).send({
                bot: response?.data?.choices[0]?.message?.content as string,
            });

        } catch (error) {
            console.error(error)
            res.status(500).send(error || 'Something went wrong');
        }
}

export default ask