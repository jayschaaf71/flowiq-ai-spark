import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    return res.status(200).json({
        success: true,
        message: 'API route is working!',
        method: req.method,
        timestamp: new Date().toISOString()
    });
}
