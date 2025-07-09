const API_BASE = 'https://api-colombia.com/api/v1/';

export async function getDepartments() {
  const res = await fetch(`${API_BASE}/Department`);
  return await res.json();
}

export async function getCitiesDepartments(id) {
  const res = await fetch(`${API_BASE}/Department/${id}/cities`);
  return await res.json();
}