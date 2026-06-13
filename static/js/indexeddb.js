const DATABASE_NAME = "steady-steps";
const DATABASE_VERSION = 1;
const SESSION_STORE = "worksheet-sessions";
const privateSessions = new Map();

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in globalThis)) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(SESSION_STORE)) {
        const store = database.createObjectStore(SESSION_STORE, { keyPath: "sessionId" });
        store.createIndex("exerciseId", "exerciseId", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
  });
}

function clone(value) {
  return structuredClone(value);
}

function nowISO() {
  return new Date().toISOString();
}

function isExpired(session) {
  return Boolean(session.expiresAt && new Date(session.expiresAt).getTime() <= Date.now());
}

function normalizeSession(session) {
  if (!session || typeof session !== "object") {
    throw new TypeError("A worksheet session object is required.");
  }
  if (!session.sessionId || !session.exerciseId) {
    throw new TypeError("Worksheet sessions require sessionId and exerciseId values.");
  }

  const timestamp = nowISO();
  return {
    sessionId: session.sessionId,
    exerciseId: session.exerciseId,
    draftAnswers: session.draftAnswers ?? {},
    currentStep: Number.isInteger(session.currentStep) ? session.currentStep : 0,
    completed: Boolean(session.completed),
    createdAt: session.createdAt ?? timestamp,
    updatedAt: timestamp,
    expiresAt: session.expiresAt ?? null,
  };
}

async function withStore(mode, operation) {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(SESSION_STORE, mode);
      const store = transaction.objectStore(SESSION_STORE);
      const request = operation(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export function createWorksheetSession(exerciseId, options = {}) {
  const sessionId = options.sessionId ?? globalThis.crypto?.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return normalizeSession({
    sessionId,
    exerciseId,
    draftAnswers: {},
    currentStep: 0,
    completed: false,
    expiresAt: options.expiresAt ?? null,
  });
}

export async function saveWorksheetSession(session, options = {}) {
  const normalized = normalizeSession(session);
  if (options.persist === false) {
    privateSessions.set(normalized.sessionId, clone(normalized));
    return clone(normalized);
  }

  privateSessions.delete(normalized.sessionId);
  await withStore("readwrite", (store) => store.put(normalized));
  return clone(normalized);
}

export async function getWorksheetSession(sessionId) {
  if (privateSessions.has(sessionId)) {
    return clone(privateSessions.get(sessionId));
  }

  const session = await withStore("readonly", (store) => store.get(sessionId));
  if (!session) return null;
  if (isExpired(session)) {
    await deleteWorksheetSession(sessionId);
    return null;
  }
  return clone(session);
}

export async function listWorksheetSessions() {
  const persisted = await withStore("readonly", (store) => store.getAll());
  const activePersisted = [];
  for (const session of persisted) {
    if (isExpired(session)) {
      await deleteWorksheetSession(session.sessionId);
    } else {
      activePersisted.push(clone(session));
    }
  }

  const activePrivate = [...privateSessions.values()].filter((session) => !isExpired(session)).map(clone);
  return [...activePersisted, ...activePrivate].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteWorksheetSession(sessionId) {
  privateSessions.delete(sessionId);
  await withStore("readwrite", (store) => store.delete(sessionId));
}

export async function deleteAllWorksheetSessions() {
  privateSessions.clear();
  await withStore("readwrite", (store) => store.clear());
}
