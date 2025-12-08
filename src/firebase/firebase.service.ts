import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      // Try to load from serviceAccountKey.json file first
      const serviceAccountPath = path.join(
        __dirname,
        'serviceAccountKey.json',
      );

      let serviceAccount: admin.ServiceAccount;

      if (fs.existsSync(serviceAccountPath)) {
        this.logger.log('Loading Firebase credentials from serviceAccountKey.json');
        serviceAccount = require('./serviceAccountKey.json');
      } else {
        // Fallback to environment variable
        const serviceAccountJson = this.configService.get<string>(
          'FIREBASE_SERVICE_ACCOUNT',
        );

        if (!serviceAccountJson) {
          this.logger.warn(
            'Firebase service account not configured. Firebase features will be disabled.',
          );
          return;
        }

        this.logger.log('Loading Firebase credentials from environment variable');
        serviceAccount = JSON.parse(serviceAccountJson);
      }

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK:', error);
      throw error;
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      this.logger.error('Error verifying Firebase token:', error);
      throw error;
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      const user = await admin.auth().getUser(uid);
      return user;
    } catch (error) {
      this.logger.error('Error getting Firebase user:', error);
      throw error;
    }
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }
}
