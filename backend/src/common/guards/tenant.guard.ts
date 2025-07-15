import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestWithTenant } from '../middleware/tenant.middleware';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithTenant>();
    
    if (!request.tenant) {
      throw new UnauthorizedException('Tenant not found in request');
    }
    
    return true;
  }
} 