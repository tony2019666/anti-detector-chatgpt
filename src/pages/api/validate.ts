import {NextApiRequest} from "next";
import {Configuration, OpenAIApi} from "openai";

// @ts-ignore
const validate = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const apiKey = req.query.apiKey as string;
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.listModels();

        res.status(200).send({
            content: response?.data,
            status: response?.status,
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
}

export default validate