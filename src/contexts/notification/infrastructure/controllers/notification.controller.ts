import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateNotificationSettingsUseCase } from '../../application/use-cases/update-notification-settings.use-case';
import { UpdateNotificationSettingsDto } from '../../application/dtos/update-notification-settings.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly updateSettingsUseCase: UpdateNotificationSettingsUseCase,
  ) {}

  @Patch('settings')
  @ApiOperation({ summary: 'Update notification preferences (Email, Slack)' })
  @ApiResponse({ status: 200, description: 'Settings successfully updated' })
  async updateSettings(@Body() dto: UpdateNotificationSettingsDto, @Req() req: any) {
    const userId = req.user.id;
    await this.updateSettingsUseCase.execute(userId, dto);
    return { message: 'Notification settings updated successfully' };
  }
}
