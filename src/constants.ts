import dotenv from 'dotenv';

dotenv.config();

export const __prod__ : boolean = process.env.NODE_ENV === 'production';
export const __dbpw__ : string = process.env.DBPW || '';