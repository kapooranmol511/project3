import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('chat')
  async generateChatResponse(@Body() body: { messages: any[], agentType: string }) {
    try {
      const { messages, agentType } = body;
      
      if (!messages || !Array.isArray(messages)) {
        throw new HttpException('Invalid messages format', HttpStatus.BAD_REQUEST);
      }
      messages.unshift({
        role: 'system',
        content: "You are a virtual doctor assistant. You can only answer questions that are strictly related to medical topics, such as symptoms, diseases, treatments, medications, health advice, and related medical concerns. If you receive a question that is not related to medicine or healthcare, politely respond: I'm sorry, I can only assist with medical-related questions. Please ask me about health, symptoms, treatments, or other medical topics."
      });
      
      const response = await this.openaiService.generateChatResponse(messages, agentType);
      return { content: response };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate response',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
