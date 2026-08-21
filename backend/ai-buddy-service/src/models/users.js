// In-memory store for the MVP so the whole team can run this without a DB
// on day one. Swap this module for a real Postgres/Prisma layer once
// docs/ARCHITECTURE.md's data models are finalized — the function
// signatures below are the contract other files depend on, so keep them
// the same when you swap the implementation.

const users = []; // { id, name, email, passwordHash, role, skillsKnown, skillsToLearn }
let nextId = 1;

export function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

export function findUserById(id) {
  return users.find((u) => u.id === id);
}

export function createUser({ name, email, passwordHash, role = "student" }) {
  const user = {
    id: nextId++,
    name,
    email,
    passwordHash,
    role, // "student" | "mentor"
    skillsKnown: [],
    skillsToLearn: [],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function allUsers() {
  return users;
}
