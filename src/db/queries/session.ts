export const read = 'SELECT session_value FROM sessions WHERE session_key = $1';
export const create = 'INSERT INTO sessions (session_key, session_value) VALUES ($1, $2)';
export const update = 'UPDATE sessions SET session_value = $2 WHERE session_key = $1';
export const del = 'DELETE FROM sessions WHERE session_key = $1';