import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/agents.module';
import { DrizzleModule } from './db/drizzle.module';

@Module({
  imports: [DrizzleModule, AgentsModule],
})
export class AppModule {}
