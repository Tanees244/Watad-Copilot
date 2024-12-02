import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('watad_copilot');
      const ordersCollection = db.collection('orders');

      const orderData = req.body;

      // Validate order data
      if (!orderData.product || !orderData.quantity) {
        return res.status(400).json({ error: 'Incomplete order information' });
      }

      // Create a draft order
      const result = await ordersCollection.insertOne({
        ...orderData,
        status: 'Pending',
        createdAt: new Date()
      });

      res.status(201).json({
        message: 'Order created successfully',
        orderId: result.insertedId
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}