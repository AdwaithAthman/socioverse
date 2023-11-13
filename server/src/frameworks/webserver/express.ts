import express, { Application, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import configKeys from '../../config';

const expressConfig = (app: Application) => {
  app.use(express.json());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet({ xssFilter: true }));
  app.use(morgan('dev'));
  app.use(passport.initialize());
  app.use(cookieParser());

  const corsOptions = {
    origin: ['*', configKeys.CLIENT_URL],
  };

  app.use(cors({ credentials: true, ...corsOptions }));
}

export default expressConfig;