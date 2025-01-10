import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.join((process.cwd(), '.env')) });



export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_host: process.env.DATABASE_HOST,
  database_user: process.env.DATABASE_USER,
  database_password: process.env.DATABASE_PASSWORD,
  database_name: process.env.DATABASE_NAME,
};
