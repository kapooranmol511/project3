import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/agents.module';
import { DrizzleModule } from './db/drizzle.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [DrizzleModule, AgentsModule, OpenAIModule],
})
export class AppModule {}
