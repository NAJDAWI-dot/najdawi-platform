import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@mos/shared';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('courses')
  getCourseReports() {
    return this.reportsService.getCourseReports();
  }

  @Get('dashboard')
  getDashboardStats() {
    return this.reportsService.getAdminDashboardStats();
  }
}
