import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

declare global {
  namespace Express {
    interface Request {
      user?: { uid: admin.auth.DecodedIdToken["uid"] };
    }
  }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) { //missing or malformed header
    return res.status(401).json({ message: 'Unauthorized: Bad header provided!' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  if (!idToken) { //missing token 
    return res.status(401).json({ message: 'Unauthorized: No token provided!' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Error verifying ID token: ', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token!' });
  }
};

export default authenticateToken;