import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { agents } from '../db/schema';
import { CreateAgentDto } from './dto/create-agent.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class AgentsService {
  constructor(private drizzle: DrizzleService) {}

  async create(createAgentDto: CreateAgentDto) {
    const result = await this.drizzle.db.insert(agents).values(createAgentDto).returning();
    return result[0];
  }

  async findAll() {
    return this.drizzle.db.select().from(agents);
  }

  async remove(id: number) {
    const result = await this.drizzle.db
      .delete(agents)
      .where(eq(agents.id, id))
      .returning();
    
    return result[0];
  }
}
