import { db } from '@/db';
import { categories } from '@/db/schema';

export const categoryNames = [
  'mobil dan kendaraan',
  'komedi',
  'edukasi',
  'gaming',
  'hiburan',
  'film dan animasi',
  'cara dan gaya',
  'musik',
  'berita dan politik',
  'orang dan blog',
  'hewan',
  'ilmu pengetahuan dan teknologi',
  'olahraga',
  'event',
];

async function main() {
  console.log('Seeding categories...');

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `video yang berhubungan dengan ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories...', error);
    process.exit(1);
  }
}

main();
