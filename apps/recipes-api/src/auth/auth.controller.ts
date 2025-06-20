import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthDto, GoogleOauthGuard } from './guards';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleOauthGuard)
  googleLogin() {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const frontendUrl = req.headers.referer!;
      const googleUser = await this.authService.validateGoogleUser(
        req.user as GoogleAuthDto,
      );
      res.cookie('access_token', googleUser.tokens.accessToken, {
        maxAge: 2592000000,
        sameSite: true,
        secure: true,
        httpOnly: true,
        //expires: new Date(jwtDecode(googleUser.tokens.accessToken).exp)
      });
      res.redirect(`${frontendUrl}/redirect`);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }
}
