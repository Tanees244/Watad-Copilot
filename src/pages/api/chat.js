//src/pages/api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import clientPromise from '../../lib/mongodb';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Define products separately for easier parsing
const products = [
  {
    "title": "Window Air Condition",
    "category": "HVAC & Refrigeration",
    "subcategory": "Split Air Conditioners & Window Air Conditioners",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FWindow%2520Air%2520Condition.jpg&w=750&q=75",
    "form_fields": {
      "fields": [
        {
          "label": "Unit of measurement",
          "type": "text",
          "required": false
        },
        {
          "label": "What is the quantity that you would like to have ?",
          "type": "number",
          "required": true
        },
        {
          "label": "Do you want to split your order ?",
          "type": "select",
          "options": [
            "false",
            "true"
          ],
          "required": false
        },
        {
          "label": "When would you like to receive your order ?",
          "type": "text",
          "required": true
        },
        {
          "label": "",
          "type": "file",
          "required": false
        },
        {
          "label": "Any other information that you want to share ?",
          "type": "textarea",
          "required": false
        }
      ]
    }
  },
{
  "title": "Male Adapter Hexagonal",
  "category": "Plumbing",
  "subcategory": "Pipes & Fittings",
  "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FMale%2520Adapter%2520Hexagonal.jpg&w=750&q=75",
  "form_fields": {
    "fields": [
      {
        "label": "Unit of measurement",
        "type": "text",
        "required": false
      },
      {
        "label": "What is the quantity that you would like to have ?",
        "type": "number",
        "required": true
      },
      {
        "label": "Do you want to split your order ?",
        "type": "select",
        "options": [
          "false",
          "true"
        ],
        "required": false
      },
      {
        "label": "When would you like to receive your order ?",
        "type": "text",
        "required": true
      },
      {
        "label": "",
        "type": "file",
        "required": false
      },
      {
        "label": "Any other information that you want to share ?",
        "type": "textarea",
        "required": false
      }
    ]
    }
  }
];

const systemInstruction = `  
  You are Watad AI Copilot, designed to help users order construction products.
  Here are the available products:

  ${JSON.stringify(products)}

  When processing an order, follow these steps:
  1. Confirm product details (title, quantity)
  2. Ask about delivery date
  3. Ask about order splitting
  4. Confirm complete order details
  5. Prepare for order confirmation

  Order Flow:
  - Always be clear and specific
  - Guide the user through each step of the order
  - Ensure all necessary information is collected
  - Use a friendly, professional tone
  - Focus on completing the order within this conversation
`;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 2000,
  responseMimeType: "text/plain",
};

let conversationHistory = [];
let currentOrderState = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userMessage } = req.body;

    try {
      // Check for order confirmation
      if (currentOrderState && 
          (userMessage.toLowerCase() === 'confirm' || userMessage.toLowerCase() === 'yes')) {
        // Validate order details
        if (!currentOrderState.product || !currentOrderState.quantity) {
          return res.status(400).json({ 
            response: "Order details are incomplete. Please start the order process again." 
          });
        }

        // Connect to MongoDB and save order
        const client = await clientPromise;
        const db = client.db('watad_copilot');
        const ordersCollection = db.collection('orders');

        const orderToSave = {
          ...currentOrderState,
          status: 'Confirmed',
          createdAt: new Date()
        };

        await ordersCollection.insertOne(orderToSave);

        // Reset order state
        const confirmationResponse = "Order confirmed successfully! Your order for " + 
          `${currentOrderState.quantity} ${currentOrderState.product.title} ` +
          `has been saved and will be processed.\n\n` +
          "Thank you for using Watad AI Copilot!";
        
        currentOrderState = null;
        conversationHistory = []; // Reset conversation

        return res.status(200).json({ response: confirmationResponse });
      }

      // Add user message to conversation history
      conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

      // Start chat session
      const chatSession = model.startChat({
        generationConfig,
        history: conversationHistory,
      });

      const result = await chatSession.sendMessage(userMessage);
      const responseText = result.response.text().trim();

      // Find matching product
      const productMatch = products.find(p => 
        userMessage.toLowerCase().includes(p.title.toLowerCase())
      );

      if (productMatch) {
        const quantityMatch = userMessage.match(/(\d+)\s*/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        
        // Initialize order state
        currentOrderState = {
          product: productMatch,
          quantity: quantity,
          deliveryDate: null,
          splitOrder: false
        };
      }

      // Check for delivery date confirmation
      const deliveryDateMatch = userMessage.match(/in\s*(\d+)\s*days/i);
      if (currentOrderState && deliveryDateMatch) {
        const days = parseInt(deliveryDateMatch[1]);
        currentOrderState.deliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }

      // Check for split order confirmation
      if (currentOrderState && userMessage.toLowerCase().includes('no split')) {
        currentOrderState.splitOrder = false;
      }

      // Add model response to conversation history
      conversationHistory.push({ role: "model", parts: [{ text: responseText }] });

      // Send response back
      res.status(200).json({ response: responseText });

    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}