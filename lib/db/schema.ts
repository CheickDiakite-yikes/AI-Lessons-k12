import { pgTable, text, timestamp, uuid, varchar, jsonb, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firebaseUid: varchar('firebase_uid', { length: 128 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('teacher'),
  school: varchar('school', { length: 255 }),
  howDidYouHear: varchar('how_did_you_hear', { length: 255 }),
  profileImageKey: text('profile_image_key'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_firebase_uid_idx').on(table.firebaseUid),
  index('users_email_idx').on(table.email),
]);

export const classRosters = pgTable('class_rosters', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('class_rosters_user_id_idx').on(table.userId),
]);

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  classRosterId: uuid('class_roster_id').notNull().references(() => classRosters.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  englishProficiency: varchar('english_proficiency', { length: 50 }).notNull().default('Expanding'),
  readingLevel: varchar('reading_level', { length: 50 }).notNull().default('At Grade'),
  mathLevel: varchar('math_level', { length: 50 }).notNull().default('At Grade'),
  writingLevel: varchar('writing_level', { length: 50 }).notNull().default('At Grade'),
  academicLevel: varchar('academic_level', { length: 50 }).notNull().default('At Grade'),
  learningPreference: varchar('learning_preference', { length: 50 }).notNull().default('Visual'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('students_class_roster_id_idx').on(table.classRosterId),
]);

export const lessonPlans = pgTable('lesson_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  classRosterId: uuid('class_roster_id').references(() => classRosters.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }),
  planLength: varchar('plan_length', { length: 100 }),
  gradeLevel: varchar('grade_level', { length: 50 }),
  subject: varchar('subject', { length: 100 }),
  duration: varchar('duration', { length: 50 }),
  content: text('content').notNull(),
  imagePrompt: text('image_prompt'),
  imageKey: text('image_key'),
  parameters: jsonb('parameters'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('lesson_plans_user_id_idx').on(table.userId),
  index('lesson_plans_class_roster_id_idx').on(table.classRosterId),
  index('lesson_plans_created_at_idx').on(table.createdAt),
]);

export const usersRelations = relations(users, ({ many }) => ({
  classRosters: many(classRosters),
  lessonPlans: many(lessonPlans),
}));

export const classRostersRelations = relations(classRosters, ({ one, many }) => ({
  user: one(users, { fields: [classRosters.userId], references: [users.id] }),
  students: many(students),
  lessonPlans: many(lessonPlans),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  classRoster: one(classRosters, { fields: [students.classRosterId], references: [classRosters.id] }),
}));

export const lessonPlansRelations = relations(lessonPlans, ({ one }) => ({
  user: one(users, { fields: [lessonPlans.userId], references: [users.id] }),
  classRoster: one(classRosters, { fields: [lessonPlans.classRosterId], references: [classRosters.id] }),
}));
