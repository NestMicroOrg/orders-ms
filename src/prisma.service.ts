
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {

    private logger = new Logger('PrismaService');

    constructor() {
        const adapter = new PrismaPg({ url: process.env.DATABASE_URL });
        super({ adapter });

        this.logger.log('Database connection established');
    }
}
