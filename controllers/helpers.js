import axios from 'axios';

export const captionSuggestions = async (req, res) => {
    try {
        const keywords = req.body; // [{key:0, label:'abc'}, ...]
        let prompt = process.env.CAPTION_PROMPT;
        for(let keyword of keywords){
            prompt += keyword.label;
            if(keyword.key === keywords.length-1) prompt += '.';
            else prompt += ', ';
        }
        let body_data = {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: prompt
            }]
        }

        const options = {
            method: 'POST',
            url: 'https://openai80.p.rapidapi.com/chat/completions',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
            },
            data: JSON.stringify(body_data)
        };

        axios.request(options).then(function (response) {
            let obj = JSON.parse(response.data.choices[0].message.content);
            console.log();
            res.status(201).json(obj);
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