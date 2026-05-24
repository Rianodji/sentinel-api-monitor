import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateEndpointUseCase } from '../../application/use-cases/create-endpoint.use-case';
import { GetUserEndpointsUseCase } from '../../application/use-cases/get-user-endpoints.use-case';
import { GetEndpointHistoryUseCase } from '../../application/use-cases/get-endpoint-history.use-case';
import { GetSlaReportUseCase } from '../../application/use-cases/get-sla-report.use-case';
import { CreateEndpointDto } from '../../application/dtos/create-endpoint.dto';

@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller('endpoints')
@UseGuards(AuthGuard('jwt'))
export class EndpointController {
  constructor(
    private readonly createEndpointUseCase: CreateEndpointUseCase,
    private readonly getUserEndpointsUseCase: GetUserEndpointsUseCase,
    private readonly getEndpointHistoryUseCase: GetEndpointHistoryUseCase,
    private readonly getSlaReportUseCase: GetSlaReportUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new endpoint' })
  @ApiResponse({ status: 201, description: 'Endpoint successfully created' })
  async create(@Body() dto: CreateEndpointDto, @Req() req: any) {
    const userId = req.user.id;
    const endpointId = await this.createEndpointUseCase.execute(dto, userId);
    return { id: endpointId, message: 'Endpoint successfully created and scheduled for monitoring' };
  }

  @Get()
  @ApiOperation({ summary: 'List all user endpoints' })
  @ApiResponse({ status: 200, description: 'List of endpoints' })
  async findAll(@Req() req: any) {
    const userId = req.user.id;
    const endpoints = await this.getUserEndpointsUseCase.execute(userId);
    return endpoints.map(e => ({
      id: e.id,
      name: e.name,
      url: e.url,
      interval: e.interval,
      status: e.status,
      lastCheck: e.lastCheck,
    }));
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get history of an endpoint' })
  @ApiResponse({ status: 200, description: 'List of health check results' })
  async getHistory(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const history = await this.getEndpointHistoryUseCase.execute(id, userId);
    return history.map(h => ({
      id: h.id,
      status: h.status,
      responseTime: h.responseTime,
      statusCode: h.statusCode,
      errorMessage: h.errorMessage,
      checkedAt: h.checkedAt,
    }));
  }

  @Get(':id/sla')
  @ApiOperation({ summary: 'Get SLA report for an endpoint' })
  @ApiResponse({ status: 200, description: 'SLA percentage for the last 30 days' })
  async getSla(@Param('id') id: string) {
    return await this.getSlaReportUseCase.execute(id);
  }
}
