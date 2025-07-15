import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InterventionsService } from './interventions.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { FindInterventionsDto } from './dto/find-interventions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('interventions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Post()
  create(@Body() createInterventionDto: CreateInterventionDto) {
    return this.interventionsService.create(createInterventionDto);
  }

  @Get()
  findAll(@Query() findInterventionsDto: FindInterventionsDto) {
    return this.interventionsService.findAll(findInterventionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interventionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInterventionDto: UpdateInterventionDto) {
    return this.interventionsService.update(id, updateInterventionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interventionsService.remove(id);
  }
} 