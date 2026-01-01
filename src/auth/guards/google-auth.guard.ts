import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // This method tells Passport which query parameters to add to the Google URL
  getAuthenticateOptions(context: ExecutionContext) {
    return {
      prompt: 'select_account', // This is what forces the "Choose an account" screen
      accessType: 'offline',    // Recommended to keep this for consistency
    };
  }
}