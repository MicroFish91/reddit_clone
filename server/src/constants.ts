import dotenv from "dotenv";

dotenv.config();

export const __prod__: boolean = process.env.NODE_ENV === "production";
export const DB_PW: string = process.env.DB_PW || "";
export const COOKIE_PW: string =
  process.env.COOKIEPW || "gjekakglje;agkejageagdsgdzxcvbz";
export const COOKIE_NAME: string = "qid";
