import { IsString, IsOptional, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class CreateInterventionDto {
  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  artisanId?: string;

  @IsString()
  description: string;

  @IsString()
  adresse: string;

  @IsOptional()
  @IsNumber()
  montant?: number;

  @IsDateString()
  echeance: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 