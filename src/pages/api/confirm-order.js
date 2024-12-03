//src/pages/api/confirm-order.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('watad_copilot');
      const ordersCollection = db.collection('orders');

      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
      }

      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: 'Confirmed', confirmedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(200).json({ 
        message: 'Order confirmed successfully',
        orderId 
      });
    } catch (error) {
      console.error('Order confirmation error:', error);
      res.status(500).json({ error: 'Failed to confirm order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}