import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity'
import { Tenant } from './entities/tenant.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email, isActive: true },
      select: ['id', 'name', 'email', 'role', 'tenantId', 'passwordHash'],
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    return user
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId }
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } })
  }
}
