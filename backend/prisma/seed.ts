/**
 * Database Seed Script
 * Runs all seed scripts in order to populate the database with test data
 */

import { seedProfiles } from './seeds/00-profiles';
import { seedCourses } from './seeds/01-courses';
import { seedEnrollments } from './seeds/02-enrollments';
import { seedAssignments } from './seeds/03-assignments';
import { seedSubmissions } from './seeds/04-submissions';
import { seedSchedule } from './seeds/05-schedule';
import { seedMessages } from './seeds/06-messages';
import { seedParentLinks } from './seeds/07-parent-links';

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Run seeds in order
    await seedProfiles();
    await seedCourses();
    await seedEnrollments();
    await seedAssignments();
    await seedSubmissions();
    await seedSchedule();
    await seedMessages();
    await seedParentLinks();

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
