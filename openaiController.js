const openai = require('./server')

const generateMeta = async (title) => {
    try {
        const description = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Come up with potential classes for this major: ${title}`
                }
            ],
            max_tokens: 100
        });

        // Debugging: Print full response
        console.log("Full API Response:", description);

        // Correct response handling
        if (!description.choices || description.choices.length === 0) {
            throw new Error("No choices returned from OpenAI API");
        }

        console.log(description.choices[0].message); // Corrected access

        return description.choices[0].message.content;
    } catch (error) {
        console.error("Error generating metadata:", error);
        return "Error generating metadata";
    }
};

    module.exports = { generateMeta };