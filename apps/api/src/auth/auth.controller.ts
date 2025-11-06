import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthDto, GoogleOauthGuard } from './guards';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleLogin() {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const frontendUrl = req.headers.referer!;
      const googleUser = await this.authService.validateGoogleUser(
        req.user as GoogleAuthDto,
      );

      // This approach is not working in production.
      // browser blocks the cookie from being set from a 3rd party domain.
      const isDev = this.configService.get('ENV') === 'dev';
      res.cookie('access_token', googleUser.tokens.accessToken, {
        maxAge: 2592000000,
        sameSite: isDev ? 'lax' : 'none',
        secure: !isDev,
        //domain: isDev ? undefined : 'recipes-ui-tau.vercel.app',
        httpOnly: true,
        //expires: new Date(jwtDecode(googleUser.tokens.accessToken).exp)
      });
      res.redirect(`${frontendUrl}recipes`);

      // res.send(`
      //   <html>
      //     <body>
      //       <form id="tokenForm" action="${frontendUrl}api/redirect" method="POST">
      //         <input type="hidden" name="access_token" value="${googleUser.tokens.accessToken}" />
      //       </form>
      //       <script>
      //         document.getElementById('tokenForm').submit();
      //       </script>
      //     </body>
      //   </html>
      // `);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }
}
