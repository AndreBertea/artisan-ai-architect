import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
    // Extension Accelerate
    Object.assign(this, this.$extends(withAccelerate()));
  }

  async onModuleInit() {
    await this.$connect();
    
    // Middleware pour injecter le tenant_id dans les requêtes
    this.$use(async (params, next) => {
      // Récupérer le tenant_id depuis le contexte PostgreSQL
      const tenantId = await this.getCurrentTenantId();
      
      if (tenantId && params.model && this.shouldApplyTenantFilter(params.model)) {
        // Ajouter le filtre tenant_id si pas déjà présent
        if (params.action === 'findMany' || params.action === 'findFirst' || params.action === 'findUnique') {
          if (!params.args?.where?.tenantId) {
            params.args = {
              ...params.args,
              where: {
                ...params.args?.where,
                tenantId,
              },
            };
          }
        }
        
        // Ajouter tenantId pour les créations
        if (params.action === 'create') {
          if (!params.args?.data?.tenantId) {
            params.args.data.tenantId = tenantId;
          }
        }
        
        // Ajouter tenantId pour les mises à jour
        if (params.action === 'update' || params.action === 'updateMany') {
          if (!params.args?.data?.tenantId) {
            params.args.data.tenantId = tenantId;
          }
        }
      }
      
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async getCurrentTenantId(): Promise<string | null> {
    try {
      const result = await this.$queryRaw`SELECT current_setting('app.tenant_id', true) as tenant_id`;
      return (result as any)[0]?.tenant_id || null;
    } catch {
      return null;
    }
  }

  private shouldApplyTenantFilter(model: string): boolean {
    const tenantModels = [
      'user',
      'client',
      'artisan',
      'intervention',
      'evaluation',
      'messageThread',
      'message',
      'task',
      'notification',
    ];
    return tenantModels.includes(model);
  }

  async setTenantId(tenantId: string): Promise<void> {
    await this.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}::text, false)`;
  }

  async clearTenantId(): Promise<void> {
    await this.$executeRaw`SELECT set_config('app.tenant_id', '', false)`;
  }
} 