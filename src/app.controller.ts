import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get system info' })
  @ApiResponse({
    status: 200,
    description: 'Returns system info',
  })
  getSysInfo(): string {
    const databaseHost = this.appService.getDatabaseHost();
    const databasePort = this.appService.getDatabasePort();
    const redisHost = this.appService.getRedisHost();
    const redisPort = this.appService.getRedisPort();

    return `Database Host: ${databaseHost}, Database Port: ${databasePort}, Redis Host: ${redisHost}, Redis Port: ${redisPort}`;
  }
}
