import { Controller, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { BadgesService, CatBadgeStatus } from '../../services/badges/badges.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('logros')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('cat-badge')
  async getCatBadgeStatus(@Req() req): Promise<CatBadgeStatus> {
    const userId = req.user.id;
    if (!userId || isNaN(userId)) {
      throw new HttpException('ID de usuario no válido en el token de autenticación.', HttpStatus.FORBIDDEN);
    }
    
    return this.badgesService.checkCatBadgeStatus(userId);
  }
}