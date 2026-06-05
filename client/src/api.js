const BASE = 'https://task-manager-api-e4cz.onrender.com/api/tasks';
 
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
 
export const api = {
  getTasks: (status = 'all', search = '') =>
    request(`${BASE}?status=${status}&search=${encodeURIComponent(search)}`),
 
  createTask: (payload) =>
    request(BASE, { method: 'POST', body: JSON.stringify(payload) }),
 
  updateTask: (id, payload) =>
    request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
 
  deleteTask: (id) =>
    request(`${BASE}/${id}`, { method: 'DELETE' }),
};