declare global {
  namespace Express {
    interface Request {
      adminId?: number;
      adminRole?: 'admin' | 'user';
    }
  }
}
