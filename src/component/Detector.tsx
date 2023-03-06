import React, {useState} from 'react';

interface DetectorProps {
    content: string;
}

const Detector: React.FC<DetectorProps> = ({content}) => {

    const [result, setResult] = useState<any>({});

    const detect = async () => {
        try{
            const token = process.env.NEXT_PUBLIC_SESS_TOKEN;
            console.log(token)
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                    'Authorization': `Bearer ${token}`,
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'Origin': 'https://platform.openai.com',
                    'Referer': 'https://platform.openai.com/',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
                body: JSON.stringify({
                    'prompt': content + "».\n<|disc_score|>",
                    'max_tokens': 1,
                    'temperature': 1,
                    'top_p': 1,
                    'n': 1,
                    'logprobs': 5,
                    'stop': '\n',
                    'stream': false,
                    'model': 'model-detect-v2',
                }),
            });
            if (response.ok) {
                const json = await response.json();
                const choices = json.choices[0];
                const logprobs = choices.logprobs.top_logprobs[0];
                const probs = Object.fromEntries(Object.entries(logprobs).map(([key, value]) => [key, 100 * Math.exp(Number(value))]));

                // Classify the result
                const classMax = [10, 45, 90, 98, 99];
                const possibleClasses = [
                    'very unlikely',
                    'unlikely',
                    'unclear if it is',
                    'possibly',
                    'likely'
                ];
                const keyProb = probs['"'];
                let classLabel;
                if (classMax[0] < keyProb && keyProb < classMax[classMax.length - 1]) {
                    const val = Math.max(...classMax.filter(i => i < keyProb));
                    classLabel = possibleClasses[classMax.indexOf(val)];
                } else if (classMax[0] > keyProb) {
                    classLabel = possibleClasses[0];
                } else {
                    classLabel = possibleClasses[possibleClasses.length - 1];
                }
                const topProb = {'Class': classLabel, 'AI-Generated Probability': keyProb};
                setResult(topProb);
            } else {
                setResult('Check prompt, Length of sentence it should be more than 1,000 characters');
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={`
            flex flex-col items-center justify-center
            h-1/2 w-screen p-3 overflow-y-auto bg-gray-100
        `}>
            <button onClick={detect} className={`
                bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110
            `}>Detect</button>
            <p className={`
                text-lg font-bold mt-3 
                ${result.Class === 'very unlikely' ? "text-green-500" : result.Class === 'unlikely' ? "text-green-500" : result.Class === 'unclear if it is' ? "text-yellow-500" : result.Class === 'possibly' ? "text-yellow-500" : result.Class === 'likely' ? "text-red-500" : "text-gray-700"}
            `}>Result: {result.Class} AI-generated</p>
            <p className={`
                text-lg font-bold mt-3
                ${result.Class === 'very unlikely' ? "text-green-500" : result.Class === 'unlikely' ? "text-green-500" : result.Class === 'unclear if it is' ? "text-yellow-500" : result.Class === 'possibly' ? "text-yellow-500" : result.Class === 'likely' ? "text-red-500" : "text-gray-700"}
            `}>AI-Generated Probability: {result['AI-Generated Probability']?.toFixed(2)}%</p>
        </div>
    );
};

export default Detector;
