export default function handler(request, response) {
  const { password } = request.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    return response.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD not set' });
  }

  if (password === ADMIN_PASSWORD) {
    return response.status(200).json({ success: true });
  } else {
    return response.status(401).json({ error: 'Unauthorized' });
  }
}
