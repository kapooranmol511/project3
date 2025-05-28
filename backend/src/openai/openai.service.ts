import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY is not set. OpenAI integration will not work.');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateChatResponse(messages: any[], agentType: string): Promise<string> {
    try {
      // Add system message based on agent type
      const systemMessage = this.getSystemPromptForAgentType(agentType);
      const fullMessages = [
        { role: 'system', content: systemMessage },
        ...messages
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Can be configured based on requirements
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content || 'No response generated';
    } catch (error) {
      this.logger.error(`Error generating OpenAI response: ${error.message}`);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  private getSystemPromptForAgentType(agentType: string): string {
    switch (agentType) {
      case 'weather':
        return 'You are a helpful weather forecasting assistant. Provide weather information and forecasts based on user queries. If you don\'t have real-time data, make it clear that you\'re providing general information.';
      case 'doctor':
        return 'You are a medical information assistant. Provide general health information and advice. Always clarify that you\'re not a licensed medical professional and serious concerns should be directed to a healthcare provider.';
      default:
        return 'You are a helpful assistant.';
    }
  }
}
