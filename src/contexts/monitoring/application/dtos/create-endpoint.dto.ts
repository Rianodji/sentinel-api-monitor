import { IsUrl, IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEndpointDto {
  @ApiProperty({ example: 'My Web Server', description: 'Name of the endpoint' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com', description: 'URL to monitor' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 60, description: 'Interval in seconds between checks (30s-86400s)' })
  @IsNumber()
  @Min(30)
  @Max(86400)
  interval: number;
}
