import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/role.decorator';
import { UserType } from 'src/enums/UserType';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoomQueryParamsDto } from './dto/room-query-params.dto';
import { LimitOnUpdateNotSupportedError } from 'typeorm';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  create(@Body(ValidationPipe) createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll(
    @Query(ValidationPipe) query: RoomQueryParamsDto,
    @Query('range', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ) {
    return this.roomService.findAll(query, limit||10);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(ValidationPipe) updateRoomDto: UpdateRoomDto
  ) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.remove(id);
  }
}
