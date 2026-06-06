import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  try {
    const espresso = await prisma.category.create({ data: { name: 'Espresso Series' } });
    const latte = await prisma.category.create({ data: { name: 'Latte Blends' } });
    const nonCoffee = await prisma.category.create({ data: { name: 'Non-Coffee Drinks' } });
    const pastry = await prisma.category.create({ data: { name: 'Grab-and-Go Pastries' } });

    await prisma.product.createMany({
      data: [
        { name: 'Classic Ice Americano', description: 'Rich espresso shot poured over ice and fresh water.', price: 25000.0, stock: 150, image_url: 'https://example.com/americano.png', category_id: espresso.id },
        { name: 'Creamy Vanilla Latte', description: 'Signature espresso blended with smooth steamed milk.', price: 32000.0, stock: 99, image_url: 'https://example.com/latte.png', category_id: latte.id },
        { name: 'Matcha Green Tea', description: 'Premium organic Japanese matcha powder mixed with fresh milk.', price: 35000.0, stock: 80, image_url: null, category_id: nonCoffee.id },
        { name: 'Butter Croissant Premium', description: 'Flaky, buttery French pastry baked golden brown daily.', price: 22000.0, stock: 45, image_url: 'https://example.com/croissant.png', category_id: pastry.id },
      ],
    });
    console.log('Database Seeding Successful!');
  } catch (error) {
    console.error(error);
  } finally {
    await app.close();
  }
}
seed();