import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';

// const { embeddings } = await embedMany({
//     model: google.embedding('gemini-embedding-001'),
//     values: [
//         'Hello world',
//         'This is a test',
//         'I am a test',
//     ]
// });

export async function embedText(values: string[], taskType: string) {
    const { embeddings} = await embedMany({
        model: google.embedding('gemini-embedding-001'),
        values: values,
        providerOptions: {
            google: { outputDimensionality: 1536, taskType }
        }
    });
    return embeddings;
}

// console.log(embeddings);