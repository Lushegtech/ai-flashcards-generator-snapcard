import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
  You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. 
  You take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
  Both front and back should be one sentence long.
  You should return in the following JSON format:
  {
    "flashcards":[
      {
        "front": "Front of the card",
        "back": "Back of the card"
      }
    ]
  }
`;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req) {
  const data = await req.text();

  try {
    const result = await model.generateContent(systemPrompt + '\n' + data);

    let flashcards;
    try {
      flashcards = JSON.parse(result.response.text());
    } catch (parseError) {
      console.error('Error parsing flashcards:', parseError);
      return new NextResponse(JSON.stringify({ error: { message: 'Error parsing flashcards.' } }), { status: 500 });
    }

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), { status: 500 });
  }
}
