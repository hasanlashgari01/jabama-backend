import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StayService } from './stay.service';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';

@Controller('stay')
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @Post()
  create(@Body() createStayDto: CreateStayDto) {
    return this.stayService.create(createStayDto);
  }

  @Get()
  findAll() {
    return this.stayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStayDto: UpdateStayDto) {
    return this.stayService.update(+id, updateStayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stayService.remove(+id);
  }
}
