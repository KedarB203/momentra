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

    // Validate that it's a JPEG URL
    if (!imageUrl.toLowerCase().includes('.jpg') && !imageUrl.toLowerCase().includes('.jpeg')) {
      console.log('⚠️ Warning: URL does not appear to be a JPEG image:', imageUrl);
    }

    // Fetch JPEG image from the provided URL
    console.log('🖼️ Fetching JPEG image from URL:', imageUrl);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch JPEG image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
    console.log('✅ JPEG image fetched successfully, size:', imageBuffer.byteLength, 'bytes');

    // Call Claude API for JPEG image analysis
    console.log('🤖 Sending JPEG image to Claude for analysis...');
    const message = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this JPEG image and provide a detailed description in the following JSON format:
              {
                "description": "A detailed description of what's in the JPEG image",
                "objects": ["list", "of", "objects", "detected", "in", "the", "image"],
                "colors": ["dominant", "colors", "in", "the", "JPEG", "image"],
                "mood": "overall mood or atmosphere of the image",
                "activities": ["activities", "or", "actions", "visible", "in", "the", "image"],
                "suggestions": ["suggestions", "for", "music", "or", "mood", "based", "on", "the", "JPEG", "image"]
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
      console.log('🤖 Raw Claude Response for JPEG:', analysisText);
      
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed JPEG Analysis:', parsedAnalysis);
        console.log('📝 JPEG Description:', parsedAnalysis.description);
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
