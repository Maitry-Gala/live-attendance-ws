import type { Server } from "node:http";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
    userId: string;
    role: "teacher" | "student";
}

export function setupWebsocket (server: Server) {
    const wss = new WebSocket({server, path: "/ws"});
}