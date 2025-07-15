import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, req: any): Promise<any> {
    const tenantId = req.body.tenantId || req.headers['x-tenant-id'];
    
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID required');
    }

    const user = await this.authService.validateUser(email, password, tenantId);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
} 