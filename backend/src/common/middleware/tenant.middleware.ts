import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

export interface RequestWithTenant extends Request {
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: RequestWithTenant, res: Response, next: NextFunction) {
    const tenantId = this.extractTenantId(req);
    
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID required');
    }

    try {
      // Vérifier que le tenant existe
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, name: true, slug: true }
      });

      if (!tenant) {
        throw new UnauthorizedException('Invalid tenant');
      }

      // Injecter le tenant_id dans le contexte PostgreSQL
      await this.prisma.setTenantId(tenantId);
      
      // Ajouter le tenant à la requête pour utilisation dans les controllers
      req.tenant = tenant;
      
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Tenant validation failed');
    }
  }

  private extractTenantId(req: Request): string | null {
    // Extraire du header X-Tenant-ID
    const headerTenantId = req.headers['x-tenant-id'] as string;
    if (headerTenantId) {
      return headerTenantId;
    }

    // Extraire du JWT token (si présent)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const payload = this.decodeJwtToken(token);
        return payload.tenantId || null;
      } catch {
        // Token invalide, continuer avec les autres méthodes
      }
    }

    // Extraire du subdomain (pour production)
    const host = req.headers.host;
    if (host && host.includes('.')) {
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        // Ici on pourrait faire une recherche par slug
        return null; // À implémenter selon la logique métier
      }
    }

    // Pour le développement, utiliser le tenant par défaut
    if (process.env.NODE_ENV === 'development') {
      return process.env.DEFAULT_TENANT_ID || null;
    }

    return null;
  }

  private decodeJwtToken(token: string): any {
    try {
      // Décodage simple du JWT (sans vérification de signature pour l'extraction)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }
} 