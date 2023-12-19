import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Response } from 'express';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserResponse } from 'src/users/dtos/user.dto';
import { JWT } from 'src/auth/dtos/jwt.dto';
import { ServiceProvider } from './dtos/service-provider.dto';
import { ParseExplicitEnumPipe } from 'src/common/pipes/eum.pipe';

@Controller('oauth')
@ApiExtraModels(UserResponse, JWT)
@ApiTags('Oauth API')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get(':serviceName/auth')
  getGoogleAuth(
    @Param('serviceName', new ParseExplicitEnumPipe(ServiceProvider))
    service: ServiceProvider,
    @Res() res: Response,
  ): void {
    const url = this.oauthService.getServiceRedirectUrl(service);
    return res.redirect(url.toString());
  }

  @ApiOkResponse({
    description: '소셜 로그인 유저 및 토큰 정보',
    schema: {
      $ref: getSchemaPath(JWT),
    },
  })
  @Post(':serviceName/user')
  async getUserFromServiceProvider(
    @Param('serviceName', new ParseExplicitEnumPipe(ServiceProvider))
    serviceName: ServiceProvider,
    @Query('code') code: string,
    // @Query('state') state: string,
  ) {
    switch (serviceName) {
      case ServiceProvider.GOOGLE:
        return await this.oauthService.userFromGoogle(code);
    }
  }
}
