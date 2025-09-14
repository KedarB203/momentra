import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured. Please set ANTHROPIC_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Fetch image from the provided URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Call Claude API for image analysis
    const message = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and provide a detailed analysis in the following JSON format:
              {
                "description": "A detailed description of what's in the image",
                "objects": ["list", "of", "objects", "detected"],
                "colors": ["dominant", "colors", "in", "the", "image"],
                "mood": "overall mood or atmosphere",
                "activities": ["activities", "or", "actions", "visible"],
                "suggestions": ["suggestions", "for", "music", "or", "mood", "based", "on", "the", "image"]
              }`
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const analysisText = content.text;
      console.log('🤖 Raw Claude Response:', analysisText);
      
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed Analysis:', parsedAnalysis);
        return NextResponse.json({ analysis: parsedAnalysis });
      } else {
        throw new Error('No valid JSON found in Claude response');
      }
    } else {
      throw new Error('Unexpected response type from Claude');
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
