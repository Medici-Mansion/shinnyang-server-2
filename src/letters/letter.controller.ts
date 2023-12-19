import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LetterService } from './letter.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LetterDetailDto } from './dtos/letter.response.dto';
import { Response } from 'src/common/interface';
import { CreateLetterDto } from './dtos/letter.request.dto';
import { AccessGuard } from 'src/auth/guards/acess.guard';

@Controller('letters')
@ApiTags('Letters API')
@ApiExtraModels(LetterDetailDto, LetterDetailDto)
@ApiBearerAuth()
export class LetterController {
  constructor(private readonly lettersService: LetterService) {}

  @ApiOperation({
    summary: '편지 생성하기',
    description: '편지를 생성한다',
  })
  @ApiCreatedResponse({
    description: '편지 생성 완료',
    schema: {
      $ref: getSchemaPath(LetterDetailDto),
    },
  })
  @Post()
  @UseGuards(AccessGuard)
  async postLetter(@Body() createLetterDto: CreateLetterDto) {
    return this.lettersService.createLetter(createLetterDto);
  }

  @ApiOperation({
    summary: '편지 상세 조회',
    description: '편지의 상세 내용을 조회한다',
  })
  @ApiOkResponse({
    description: '편지 상세 조회',
    schema: {
      $ref: getSchemaPath(LetterDetailDto),
    },
  })
  @Get(':letterId')
  async getLetterDetail(
    @Param('letterId', ParseUUIDPipe) letterId: string,
  ): Promise<Response<LetterDetailDto>> {
    return this.lettersService.getLetterDetail(letterId);
  }
}
