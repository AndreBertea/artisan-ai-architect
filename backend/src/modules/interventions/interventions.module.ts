import { Module } from '@nestjs/common';
import { InterventionsController } from './interventions.controller';
import { InterventionsService } from './interventions.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InterventionsController],
  providers: [InterventionsService],
  exports: [InterventionsService],
})
export class InterventionsModule {} 