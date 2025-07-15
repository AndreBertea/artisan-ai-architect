import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { FindInterventionsDto } from './dto/find-interventions.dto';

@Injectable()
export class InterventionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInterventionDto: CreateInterventionDto) {
    const { clientId, artisanId, ...rest } = createInterventionDto;
    return this.prisma.intervention.create({
      data: {
        ...rest,
        clientId,
        ...(artisanId ? { artisanId } : {}),
        // Le tenantId est automatiquement injecté par le middleware Prisma
      } as any, // Utiliser 'as any' pour éviter les conflits de type avec Prisma
    });
  }

  async findAll(findInterventionsDto: FindInterventionsDto) {
    const { page = 1, limit = 10, ...filters } = findInterventionsDto;
    
    return this.prisma.intervention.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        artisan: true,
        client: true,
      },
    });
  }

  async findOne(id: string) {
    const intervention = await this.prisma.intervention.findUnique({
      where: { id },
      include: {
        artisan: true,
        client: true,
      },
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention with ID ${id} not found`);
    }

    return intervention;
  }

  async update(id: string, updateInterventionDto: UpdateInterventionDto) {
    await this.findOne(id);

    return this.prisma.intervention.update({
      where: { id },
      data: updateInterventionDto,
      include: {
        artisan: true,
        client: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.intervention.delete({
      where: { id },
    });
  }
} 