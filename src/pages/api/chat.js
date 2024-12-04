import connectMongoDB from '../../utils/dbConnect';
import Order from '../../models/Order';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
Watad AI Copilot Order Flow Instructions:

1. Order Collection Process:
- Collect order details in a step-by-step manner
- Ask clarifying questions to get complete information
- Track the current state of order collection
- Use JSON response format for structured data

2. Predefined Products:
You can only choose from the following products:
- Float Valves (Plumbing > Control Valves)
- Strip Light (Electrical > Lights & Bulbs)

3. Response Format:
{
  "responseType": "order_collection" | "order_confirmation" | "final_order",
  "text": "Conversational response to user",
  "currentStep": "product_selection" | "quantity" | "delivery" | "customer_info" | "confirmation",
  "orderDetails": {
    "product": "",
    "quantity": 0,
    "unit": "",
    "deliveryDate": "",
    "splitOrder": false,
    "customerInfo": {
      "name": "",
      "phone": "",
      "address": ""
    }
  }
}

4. Order Collection Steps:
- First, confirm the specific product from the predefined list
- Ask for quantity and unit
- Discuss delivery preferences
- Collect customer information
- Request final confirmation

5. Validation Rules:
- Product must be from the predefined list
- Quantity must be a positive number
- Customer info must include name, phone, address
- Handle incomplete or incorrect inputs gracefully
  `
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 2000,
};

// Global variable to track order state
let currentOrderState = {
  orderDetails: {},
  conversationHistory: []
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userMessage, conversationContext = {} } = req.body;

    try {
      await connectMongoDB();

      currentOrderState.conversationHistory.push({ 
        role: "user", 
        parts: [{ text: userMessage }] 
      });

      const chatSession = model.startChat({
        generationConfig,
        history: currentOrderState.conversationHistory
      });

      const result = await chatSession.sendMessage(
        JSON.stringify({
          userMessage,
          currentOrderState: currentOrderState.orderDetails
        })
      );

      const rawResponseText = await result.response.text();
      const responseText = rawResponseText.replace(/```json|```/g, "").trim();
      console.log("Sanitized Response:", responseText);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (error) {
        console.error("Response parsing failed:", error);
        return res.status(400).json({ error: "Invalid AI response format" });
      }

      // Update order state
      if (parsedResponse.orderDetails) {
        currentOrderState.orderDetails = {
          ...currentOrderState.orderDetails,
          ...parsedResponse.orderDetails
        };
      }

      // Add response to conversation history
      currentOrderState.conversationHistory.push({ 
        role: "model", 
        parts: [{ text: responseText }] 
      });

      // Final order confirmation and save
      if (parsedResponse.responseType === "final_order") {
        const newOrder = new Order({
          userId: req.session?.userId || "anonymous",
          products: [ 
            {
              name: currentOrderState.orderDetails.product,
              quantity: currentOrderState.orderDetails.quantity,
              price: 0  // Implement actual pricing logic
            }
          ],
          totalAmount: 0,
          status: "pending",
          customerName: currentOrderState.orderDetails.customerInfo.name,
          customerPhone: currentOrderState.orderDetails.customerInfo.phone,
          customerAddress: currentOrderState.orderDetails.customerInfo.address,
          additionalNotes: JSON.stringify({
            splitOrder: currentOrderState.orderDetails.splitOrder,
            deliveryDate: currentOrderState.orderDetails.deliveryDate
          })
        });

        const savedOrder = await newOrder.save();

        // Reset order state after saving
        currentOrderState = { orderDetails: {}, conversationHistory: [] };

        return res.status(200).json({
          response: parsedResponse.text,
          orderId: savedOrder._id
        });
      }

      return res.status(200).json({ 
        response: parsedResponse.text,
        currentStep: parsedResponse.currentStep
      });

    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ 
        error: "Something went wrong", 
        details: error.message 
      });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
