import { JwtPayload } from 'jsonwebtoken';
// import { TJwtPayload } from '../modules/Auth/auth.interface';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
