import { toNodeHandler } from "better-auth/node";
import {auth} from "@/lib/auth/index";

export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);
