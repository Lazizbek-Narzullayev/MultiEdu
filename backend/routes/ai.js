const express = require('express');
const router = express.Router();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

router.post('/chat', async (req, res) => {
    const { contents, systemContext } = req.body;
    
    // Gemini formatini Groq (OpenAI) formatiga o'tkazamiz
    const messages = [
        { role: 'system', content: systemContext },
        ...contents.map(item => ({
            role: item.role === 'model' ? 'assistant' : 'user',
            content: item.parts[0].text
        }))
    ];

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: GROQ_MODEL,
                messages: messages
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Javobni Gemini formatiga o'xshatib qaytaramiz (Frontend o'zgarmasligi uchun)
        const aiReply = response.data.choices[0].message.content;
        res.json({
            candidates: [{
                content: {
                    parts: [{ text: aiReply }]
                }
            }]
        });
    } catch (error) {
        console.error('Groq Chat Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { msg: 'Groq Error' });
    }
});

router.post('/summary', async (req, res) => {
    const { prompt, systemContext } = req.body;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: GROQ_MODEL,
                messages: [
                    { role: 'system', content: systemContext },
                    { role: 'user', content: prompt }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiSummary = response.data.choices[0].message.content;
        res.json({
            candidates: [{
                content: {
                    parts: [{ text: aiSummary }]
                }
            }]
        });
    } catch (error) {
        console.error('Groq Summary Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { msg: 'Groq Error' });
    }
});

router.post('/translate', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Text is required' });

    try {
        const rawLines = text.split('\n').map(l => l.trim()).filter(l => l);
        let entries = [];

        // 1. Matnni tahlil qilish
        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i];
            const timeMatch = line.match(/^\[?(\d{1,2}:?\d{2})\]?\s*(.*)$/);
            if (timeMatch) {
                const time = timeMatch[1];
                const content = timeMatch[2].trim();
                if (content) {
                    entries.push({ time, text: content });
                } else {
                    const nextLine = (i + 1 < rawLines.length) ? rawLines[i+1] : "";
                    const nextTimeMatch = nextLine.match(/^\[?(\d{1,2}:?\d{2})\]?/);
                    if (nextLine && !nextTimeMatch) {
                        entries.push({ time, text: nextLine });
                        i++;
                    } else {
                        entries.push({ time, text: "..." });
                    }
                }
            } else {
                entries.push({ time: null, text: line });
            }
        }

        // 2. Raqamlangan qatorlar bilan tarjima qilish
        const chunkSize = 15;
        let translatedMap = {};
        let globalIdx = 0;

        for (let i = 0; i < entries.length; i += chunkSize) {
            const chunk = entries.slice(i, i + chunkSize);
            let promptLines = chunk.map((e, idx) => `${globalIdx + idx}: ${e.text}`).join('\n');

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { 
                            role: 'system', 
                            content: `SIZ PROFESSIONAL TARJIMONSIZ.
                            VAZIFANGIZ: Berilgan raqamlangan qatorlarni o'zbekchaga tarjima qilish.
                            FORMAT: 'ID: Tarjima' ko'rinishida qaytaring.
                            QOIDALAR: 
                            1. Har bir raqamli qatorni alohida tarjima qiling.
                            2. Raqamlarni (ID) o'zgartirmang.
                            3. FAQAT tarjimani qaytaring.` 
                        },
                        { role: 'user', content: promptLines }
                    ],
                    temperature: 0.1
                },
                {
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const results = response.data.choices[0].message.content.split('\n');
            results.forEach(resLine => {
                const match = resLine.match(/^(\d+):\s*(.*)$/);
                if (match) {
                    translatedMap[parseInt(match[1])] = match[2].trim();
                }
            });
            globalIdx += chunkSize;
        }

        // 3. Qayta yig'ish
        const finalOutput = entries.map((entry, idx) => {
            const translated = translatedMap[idx] || entry.text;
            if (entry.time) {
                const [min, sec] = entry.time.split(':').map(Number);
                const formattedTime = `[${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}]`;
                return `${formattedTime} ${translated}`;
            }
            return translated;
        });

        res.json({
            candidates: [{
                content: {
                    parts: [{ text: finalOutput.join('\n') }]
                }
            }]
        });
    } catch (error) {
        console.error('Groq Final Error:', error.response?.data || error.message);
        res.status(500).json({ msg: 'Tarjimada xatolik yuz berdi' });
    }
});

module.exports = router;
