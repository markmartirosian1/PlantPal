import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface WateringFrequencyResponse {
  suggestedFrequency: number;
  reasoning: string;
}

export const getSuggestedWateringFrequency = async (plantName: string, scientificName?: string): Promise<WateringFrequencyResponse> => {
  console.log('🌱 OPENAI API CALL STARTED');
  console.log('   Plant Name:', plantName);
  console.log('   Scientific Name:', scientificName || 'Not provided');
  
  // Debug environment variables
  console.log('🔍 ENVIRONMENT VARIABLES DEBUG:');
  console.log('   OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
  console.log('   OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
  console.log('   OPENAI_API_KEY starts with sk-:', OPENAI_API_KEY ? OPENAI_API_KEY.startsWith('sk-') : false);
  console.log('   OPENAI_API_KEY first 10 chars:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'undefined');
  
  try {
    const plantInfo = scientificName ? `${plantName} (${scientificName})` : plantName;
    console.log('   Combined Plant Info:', plantInfo);
    
    // Check if API key is available
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY is not defined in environment variables');
      console.error('   This could mean:');
      console.error('   1. The .env file is missing or incorrectly formatted');
      console.error('   2. The development server needs to be restarted');
      console.error('   3. The babel configuration is incorrect');
      throw new Error('OpenAI API key not configured');
    }
    console.log('✅ OPENAI_API_KEY is configured');
    
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a plant care expert. Provide watering frequency recommendations in days. Respond with only a JSON object containing "suggestedFrequency" (number of days) and "reasoning" (brief explanation).'
        },
        {
          role: 'user',
          content: `What is the recommended watering frequency in days for a ${plantInfo}? Consider factors like plant type, typical water needs, and common care practices.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    };
    
    console.log('📤 SENDING REQUEST TO OPENAI API');
    console.log('   URL:', OPENAI_API_URL);
    console.log('   Request Body:', JSON.stringify(requestBody, null, 2));
    
    const startTime = Date.now();
    
    const response = await axios.post(
      OPENAI_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 30000, // 30 second timeout
      }
    );
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log('✅ OPENAI API RESPONSE RECEIVED');
    console.log('   Response Time:', responseTime + 'ms');
    console.log('   Status Code:', response.status);
    console.log('   Status Text:', response.statusText);
    console.log('   Response Headers:', response.headers);
    
    if (response.status !== 200) {
      console.error('❌ OPENAI API returned non-200 status:', response.status);
      throw new Error(`OpenAI API returned status ${response.status}`);
    }
    
    console.log('📄 RESPONSE DATA STRUCTURE:');
    console.log('   Response has choices:', !!response.data.choices);
    console.log('   Number of choices:', response.data.choices?.length || 0);
    console.log('   First choice exists:', !!response.data.choices?.[0]);
    console.log('   First choice has message:', !!response.data.choices?.[0]?.message);
    console.log('   Message has content:', !!response.data.choices?.[0]?.message?.content);
    
    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.error('❌ No response content from OpenAI');
      console.log('   Full response data:', JSON.stringify(response.data, null, 2));
      throw new Error('No response content from OpenAI');
    }
    
    console.log('📝 RAW OPENAI RESPONSE CONTENT:');
    console.log('   Content:', content);
    console.log('   Content length:', content.length);
    console.log('   Content type:', typeof content);
    
    // Try to parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
      console.log('✅ JSON PARSING SUCCESSFUL');
      console.log('   Parsed response:', JSON.stringify(parsedResponse, null, 2));
    } catch (parseError) {
      console.error('❌ JSON PARSING FAILED');
      console.log('   Parse error:', parseError);
      console.log('   Raw content that failed to parse:', content);
      
      // Try to extract frequency from text if JSON parsing fails
      const frequencyMatch = content.match(/(\d+)\s*days?/i);
      if (frequencyMatch) {
        const extractedFrequency = parseInt(frequencyMatch[1], 10);
        console.log('🔍 EXTRACTED FREQUENCY FROM TEXT:', extractedFrequency);
        parsedResponse = {
          suggestedFrequency: extractedFrequency,
          reasoning: 'Extracted from text response due to JSON parsing failure'
        };
      } else {
        throw new Error('Failed to parse JSON response and could not extract frequency from text');
      }
    }
    
    // Validate the parsed response
    if (!parsedResponse.suggestedFrequency || typeof parsedResponse.suggestedFrequency !== 'number') {
      console.error('❌ INVALID RESPONSE: missing or invalid suggestedFrequency');
      console.log('   Parsed response:', parsedResponse);
      throw new Error('Invalid response: missing or invalid suggestedFrequency');
    }
    
    if (!parsedResponse.reasoning || typeof parsedResponse.reasoning !== 'string') {
      console.error('❌ INVALID RESPONSE: missing or invalid reasoning');
      console.log('   Parsed response:', parsedResponse);
      throw new Error('Invalid response: missing or invalid reasoning');
    }
    
    const result = {
      suggestedFrequency: parsedResponse.suggestedFrequency,
      reasoning: parsedResponse.reasoning
    };
    
    console.log('🎉 OPENAI API CALL SUCCESSFUL');
    console.log('   Final Result:', JSON.stringify(result, null, 2));
    console.log('   Suggested Frequency:', result.suggestedFrequency, 'days');
    console.log('   Reasoning:', result.reasoning);
    
    return result;
  } catch (error) {
    console.error('❌ OPENAI API CALL FAILED');
    console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('   Error message:', error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.error('   Axios error details:');
      console.error('     Status:', error.response?.status);
      console.error('     Status text:', error.response?.statusText);
      console.error('     Response data:', error.response?.data);
      console.error('     Request config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
    }
    
    console.log('🔄 FALLING BACK TO DEFAULT FREQUENCY');
    const fallbackResult = {
      suggestedFrequency: 7,
      reasoning: 'Default recommendation due to API error: ' + (error instanceof Error ? error.message : String(error))
    };
    console.log('   Fallback result:', JSON.stringify(fallbackResult, null, 2));
    
    return fallbackResult;
  }
}; 