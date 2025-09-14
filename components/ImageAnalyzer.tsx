'use client';

import React, { useState, useCallback, useEffect } from 'react';

// Local type definition
interface DayRecord {
  id: number;
  image_urls: string[];
  music_url: string;
  created_at?: string;
}

// Types for Claude API responses
interface ImageAnalysis {
  description: string;
  objects: string[];
  colors: string[];
  mood: string;
  activities: string[];
  suggestions: string[];
}

interface AnalysisResult {
  analysis: ImageAnalysis;
  timestamp: string;
  imageUrl: string;
}

interface ImageAnalyzerProps {
  dayRecord?: DayRecord;
  currentImageIndex?: number;
}

export default function ImageAnalyzer({ dayRecord, currentImageIndex = 0 }: ImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (imageUrl: string): Promise<ImageAnalysis> => {
    try {
      console.log('🔄 Calling Claude API for image analysis...');
      console.log('🖼️ Analyzing image URL:', imageUrl);
      
      // Call our API route
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Claude API Response:', data);
      console.log('📊 Analysis Details:', JSON.stringify(data.analysis, null, 2));
      
      return data.analysis;
    } catch (error) {
      console.error('❌ Error analyzing image:', error);
      throw error;
    }
  }, []);

  const handleAnalyze = async () => {
    if (!dayRecord?.image_urls || dayRecord.image_urls.length === 0) {
      console.log('❌ No images available for analysis');
      setError('No images available for analysis');
      return;
    }

    const imageUrl = dayRecord.image_urls[currentImageIndex];
    if (!imageUrl) {
      console.log('❌ No image at current index:', currentImageIndex);
      setError('No image at current index');
      return;
    }

    console.log('🚀 STARTING IMMEDIATE IMAGE ANALYSIS - Supabase data ready!');
    console.log('📊 Current image index:', currentImageIndex);
    console.log('🔗 Image URL:', imageUrl);
    console.log('📋 Image URL length:', imageUrl.length);
    console.log('⚡ Analysis starting NOW...');

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeImage(imageUrl);
      
      const result: AnalysisResult = {
        analysis,
        timestamp: new Date().toISOString(),
        imageUrl
      };

      // Print comprehensive analysis results to console
      console.log('🎯 Claude AI Analysis Result:', result);
      console.log('📝 Detailed Analysis:', analysis);
      console.log('🖼️ Image URL:', imageUrl);
      console.log('⏰ Timestamp:', result.timestamp);
      console.log('📋 Full Analysis JSON:', JSON.stringify(analysis, null, 2));
      
      // Print each analysis section separately for easy reading
      console.log('📖 DESCRIPTION:', analysis.description);
      console.log('🔍 OBJECTS DETECTED:', analysis.objects);
      console.log('🎨 COLORS:', analysis.colors);
      console.log('😊 MOOD:', analysis.mood);
      console.log('🏃 ACTIVITIES:', analysis.activities);
      console.log('🎵 MUSIC SUGGESTIONS:', analysis.suggestions);

      setAnalysisResult(result);
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      console.log('🏁 Analysis process completed');
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze when dayRecord or currentImageIndex changes
  useEffect(() => {
    if (dayRecord?.image_urls && dayRecord.image_urls.length > 0) {
      console.log('🔄 IMMEDIATE ANALYSIS TRIGGERED - Supabase data loaded!');
      console.log('📊 DayRecord loaded:', dayRecord);
      console.log('🖼️ Total images available:', dayRecord.image_urls.length);
      console.log('⚡ Starting analysis immediately...');
      handleAnalyze();
    }
  }, [dayRecord, currentImageIndex]);

  if (!dayRecord?.image_urls || dayRecord.image_urls.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Current Image'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {analysisResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Analysis completed! Check console for detailed results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
