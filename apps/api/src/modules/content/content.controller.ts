import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';
import { CreateContentItemDto, UpdateContentItemDto } from './content-item.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@mos/shared';

@Controller('courses/:courseId/content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  findByCourse(@Param('courseId') courseId: string) {
    return this.contentService.findByCourse(courseId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  create(@Param('courseId') courseId: string, @Body() dto: CreateContentItemDto) {
    return this.contentService.create(courseId, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  update(@Param('id') id: string, @Body() dto: UpdateContentItemDto) {
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
