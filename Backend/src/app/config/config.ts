import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.join((process.cwd(), '.env')) });

export const node_env = process.env.NODE_ENV;
export const base_url = node_env != 'production' ? process.env.BASE_URL: process.env.PRODUCTION_BASE_URL;
export const port = process.env.PORT;
export const salt = process.env.SALT;
export const jwt_secret_key = process.env.JWT_SECRET;
export const imgbb_api_key = process.env.IMG_BB_API_KEY;
export const database_host = process.env.DATABASE_HOST;
export const database_user = process.env.DATABASE_USER;
export const database_password = process.env.DATABASE_PASSWORD;
export const database_name = process.env.DATABASE_NAME;

// export {
//   node_env: process.env.NODE_ENV,
//   port: process.env.PORT,
//   salt:process.env.SALT,
//   jwt_secret_key: process.env.JWT_SECRET,
//   database_host: process.env.DATABASE_HOST,
//   database_user: process.env.DATABASE_USER,
//   database_password: process.env.DATABASE_PASSWORD,
//   database_name: process.env.DATABASE_NAME,
// };
