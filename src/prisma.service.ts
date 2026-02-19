import 'dotenv/config';

import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {

    private logger = new Logger('PrismaService');

    constructor() {
        const connectionString = process.env.DATABASE_URL;
        const adapter = new PrismaPg({
            connectionString,
        });
        super({ adapter });
        this.logger.log('URL', connectionString);

        this.logger.log('Database connection established');
    }
}
