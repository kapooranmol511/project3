import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
});
