interface ActiveSession {
    classId : string;
    startedAt: string;
    attendance: Record<string, "present" | "absent">;
}

export let activeSession : ActiveSession | null = null;

export function setActiveSession (data: ActiveSession) {
    activeSession = data;
}

export function clearActiveSession() {
    activeSession = null;
}