// pages/api/hello.js

export default function handler(req, res) {
    if (req.method === 'GET') {
      // Manejar la solicitud GET
      res.status(200).json({ message: 'Hello from Next.js API!' });
    } else if (req.method === 'POST') {
      // Manejar la solicitud POST
      res.status(200).json({ message: 'POST request received!' });
    } else {
      // Manejar otros tipos de solicitudes
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  