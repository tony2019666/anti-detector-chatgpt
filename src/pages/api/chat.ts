import {NextApiRequest} from "next";
import {Configuration, OpenAIApi} from "openai";


// @ts-ignore
const ask = async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const {
                prompt,
                wordLimit,
                apiKey,
            } = req.body as {
                prompt: string,
                wordLimit: number,
                apiKey: string
            }

            const configuration = new Configuration({
                apiKey: apiKey,
            });
            const openai = new OpenAIApi(configuration);

            let temp: number = 1.5
            let fp: number = 1.0

            if (wordLimit <= 250) {
                temp = 1.7
                fp = 2.0
            } else if (250 < wordLimit && wordLimit <= 500) {
                temp = 1.5
                fp = 1.2
            } else if (500 < wordLimit && wordLimit <= 750) {
                temp = 1.1
                fp = 0.6
            } else if (750 < wordLimit && wordLimit <= 1000) {
                temp = 1.1
                fp = 0.5
            } else if (1000 < wordLimit) {
                temp = 1.0
                fp = 0.4
            }

            console.log(`temp: ${temp}, fp: ${fp}`)

            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `${prompt} with ${wordLimit} words`,
                    }],
                max_tokens: wordLimit,
                temperature: temp, // Higher values means the model will take more risks.
                top_p: 0.95, // alternative to sampling with temperature, called nucleus sampling
                frequency_penalty: fp, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
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