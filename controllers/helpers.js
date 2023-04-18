import axios from 'axios';

export const captionSuggestions = async (req, res) => {
    try {
        const { keywords } = req.body; // [abc, xyz, mno]
        let prompt = process.env.CAPTION_PROMPT;
        for(let keyword of keywords){
            prompt += keyword + ', ';
        }
        prompt.length -= 2;
        prompt += '.';
        let body_data = {
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 7,
            temperature: 0,
            top_p: 1,
            n: 1,
            stream: false,
            logprobs: null,
            stop: "\n"
        }

        const options = {
            method: 'POST',
            url: 'https://openai80.p.rapidapi.com/completions',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
            },
            data: JSON.stringify(body_data)
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            res.status(201).json(response.data);
        }).catch(function (error) {
            console.error(error);
            res.status(404).json({
                error: error.message
            });
        });

    } catch (err) {
        console.log('Error: ', err);
        res.status(404).json({
            error: err.message
        });
    }
};