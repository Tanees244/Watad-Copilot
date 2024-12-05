import connectMongoDB from '../../utils/dbConnect';
import Order from '../../models/Order';
import { GoogleGenerativeAI } from '@google/generative-ai';
import clientPromise from '../../lib/mongodb';

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
Products= [
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
      "title": "Reducer",
      "category": "Plumbing",
      "subcategory": "Pipes & Fittings",
      "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FReducer.png&w=750&q=75",
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
    "title": "Chequered plate",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FChequered%2520plate.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "5338",
            "5339",
            "5340",
            "5341",
            "5342",
            "5343",
            "5344",
            "5345",
            "5346",
            "5347",
            "5348",
            "5349",
            "5350",
            "5351",
            "5352",
            "5353",
            "5354",
            "5355",
            "5356",
            "5357",
            "5358",
            "5359",
            "5360",
            "5361",
            "5362",
            "5363",
            "5364",
            "5365",
            "5366",
            "5367",
            "5368",
            "5369",
            "5370",
            "5371",
            "5372",
            "5373",
            "5375",
            "5376",
            "5377",
            "5378",
            "5379",
            "5380",
            "5381",
            "5382",
            "5383",
            "5384",
            "5385",
            "5386",
            "5387",
            "5388",
            "5389",
            "5390",
            "5391",
            "5392",
            "5393",
            "5394",
            "5395",
            "5396",
            "5397",
            "5398",
            "5399",
            "5400",
            "5401",
            "5402",
            "5404",
            "5405",
            "5406",
            "5407",
            "5408",
            "5409",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Check valves",
    "category": "Plumbing",
    "subcategory": "Control Valves",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FCheck%2520valves.jpg&w=750&q=75",
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
    "title": "Cementitious coating",
    "category": "Insulators",
    "subcategory": "Coating",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FCementitious%2520coating.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6065",
            "6066",
            "6509",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Tee 90°",
    "category": "Plumbing",
    "subcategory": "Drainage",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FTee%252090%25C2%25B0.jpg&w=750&q=75",
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
    "title": "Bituminous Protection Board",
    "category": "Insulators",
    "subcategory": "Water Proofing",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FWater%2520Proofing%2520%25D8%25B9%25D9%2588%25D8%25A7%25D8%25B2%25D9%2584%2520%25D8%25A7%25D9%2584%25D9%2585%25D9%258A%25D8%25A7%25D9%2587.jpeg&w=750&q=75",
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
        },
        {
          "label": "Is installation required?",
          "type": "select",
          "options": [
            "false",
            "true"
          ],
          "required": false
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6465",
            "6466",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Pipe",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FPipe.jpg&w=750&q=75",
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
    "title": "Elbow 45°",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FElbow%252045%25C2%25B0.png&w=750&q=75",
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
    "title": "Branch Breaker",
    "category": "Electrical",
    "subcategory": "Circuit Breakers",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FBranch%2520Breaker.jpg&w=750&q=75",
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
    "title": "Switchs",
    "category": "Electrical",
    "subcategory": "Switches & Sockets",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FSwitchs.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "5508",
            "5509",
            "5510",
            "5511",
            "5512",
            "5513",
            "5514",
            "5515",
            "5516",
            "5517",
            "5518",
            "5519",
            "5520",
            "5521",
            "5522",
            "5523",
            "5524",
            "5525",
            "5526",
            "5527",
            "5528",
            "5529",
            "5530",
            "5531",
            "5532",
            "5533",
            "5534",
            "5535",
            "5536",
            "5537",
            "5538",
            "5539",
            "5540",
            "5541",
            "5542",
            "5543",
            "5544",
            "5545",
            "5546",
            "5547",
            "5548",
            "5549",
            "5550",
            "5551",
            "5552",
            "5553",
            "5554",
            "5555",
            "5556",
            "5557",
            "5558",
            "5559",
            "5560",
            "5561",
            "5562",
            "5563",
            "5564",
            "5565",
            "5566",
            "5567",
            "5568",
            "5569",
            "5570",
            "5571",
            "5572",
            "5573",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "H beams",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FH%2520beams.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6465",
            "6466",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Pipe Clip",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FPipe%2520Clip.jpg&w=750&q=75",
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
    "title": "Pipe",
    "category": "Plumbing",
    "subcategory": "Drainage",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FPipe.jpg&w=750&q=75",
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
    "title": "Round bar",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FRound%2520bar.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6465",
            "6466",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Chain Link Fence",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=%2Fassets%2Fimages%2Fproduct-placeholder.png&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6465",
            "6466",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Female Adapter",
    "category": "Plumbing",
    "subcategory": "Drainage",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FFemale%2520Adapter.jpg&w=750&q=75",
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
    "title": "Low Voltage Non-Armored Cable",
    "category": "Electrical",
    "subcategory": "Cables & Wires",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FLow%2520Voltage%2520Non-Armored%2520Cable.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6357",
            "6362",
            "6395",
            "5726",
            "6512",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Union",
    "category": "Plumbing",
    "subcategory": "Drainage",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FUnion.jpg&w=750&q=75",
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
    "title": "Stainless steel sheet",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FStainless%2520steel%2520sheet.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6065",
            "6066",
            "6509",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "U Chanel",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FU%2520Chanel.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6465",
            "6466",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "End Cap",
    "category": "Plumbing",
    "subcategory": "Drainage",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FEnd%2520Cap.jpg&w=750&q=75",
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
    "title": "Pendant Light",
    "category": "Electrical",
    "subcategory": "Lights & Bulbs",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FPendant%2520Light.jpg&w=750&q=75",
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
    "title": "Barbed wire",
    "category": "Steel",
    "subcategory": "Commercial Steel",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FBarbed%2520wire.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "6465",
            "6466",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Female Adapter Hexagonal",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FFemale%2520Adapter%2520Hexagonal.jpg&w=750&q=75",
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
    "title": "Duct Fans",
    "category": "Electrical",
    "subcategory": "Fans",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FDuct%2520Fans.jpg&w=750&q=75",
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
    "title": "Fiber Composite Pipe",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FFiber%2520Composite%2520Pipe.jpg&w=750&q=75",
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
    "title": "Socket",
    "category": "Plumbing",
    "subcategory": "Drainage",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FSocket.jpg&w=750&q=75",
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
    "title": "Cassette Air Condition",
    "category": "HVAC & Refrigeration",
    "subcategory": "Split Air Conditioners & Window Air Conditioners",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FCassette%2520Air%2520Condition.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "5096",
            "5097",
            "5098",
            "5099",
            "5100",
            "5101",
            "5102",
            "5103",
            "5104",
            "5105",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Coupling",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FCoupling.png&w=750&q=75",
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
    "title": "Elbow 90°",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2Fshutterstock_1301678215.jpg&w=750&q=75",
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
    "title": "Sockets",
    "category": "Electrical",
    "subcategory": "Switches & Sockets",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FSockets.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "5508",
            "5509",
            "5510",
            "5511",
            "5512",
            "5513",
            "5514",
            "5515",
            "5516",
            "5517",
            "5518",
            "5519",
            "5520",
            "5521",
            "5522",
            "5523",
            "5524",
            "5525",
            "5526",
            "5527",
            "5528",
            "5529",
            "5530",
            "5531",
            "5532",
            "5533",
            "5534",
            "5535",
            "5536",
            "5537",
            "5538",
            "5539",
            "5540",
            "5541",
            "5542",
            "5543",
            "5544",
            "5545",
            "5546",
            "5547",
            "5548",
            "5549",
            "5550",
            "5551",
            "5552",
            "5553",
            "5554",
            "5555",
            "5556",
            "5557",
            "5558",
            "5559",
            "5560",
            "5561",
            "5562",
            "5563",
            "5564",
            "5565",
            "5566",
            "5567",
            "5568",
            "5569",
            "5570",
            "5571",
            "5572",
            "5573",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Submersible pump",
    "category": "Plumbing",
    "subcategory": "Water Pump",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FSubmersible%2520pump.jpg&w=750&q=75",
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
    "title": "Bridge Bend",
    "category": "Plumbing",
    "subcategory": "Pipes & Fittings",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FBridge%2520Bend.jpg&w=750&q=75",
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
    "title": "Low Voltage Distribution Panel Board",
    "category": "Electrical",
    "subcategory": "Circuit Breakers",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FLow%2520Voltage%2520Distribution%2520Panel%2520Board.jpg&w=750&q=75",
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
    "title": "NYA Wire",
    "category": "Electrical",
    "subcategory": "Cables & Wires",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FNYA%2520Wire.jpg&w=750&q=75",
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
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "5730",
            "5733",
            "5734",
            "5744",
            "5745",
            "5747",
            "5749",
            "5750",
            "5751",
            "5752",
            "5753",
            "5754",
            "5755",
            "5761",
            "5762",
            "5763",
            "5764",
            "5767",
            "5768",
            "5769",
            "5770",
            "5771",
            "5773",
            "5775",
            "5779",
            "5782",
            "5783",
            "5784",
            "5805",
            "5806",
            "5807",
            "5808",
            "5825",
            "5826",
            "5828",
            "5829",
            "5830",
            "5832",
            "5833",
            "5834",
            "5838",
            "5840",
            "5146",
            "5167",
            "5138",
            "5139",
            "5823",
            "5824",
            "5852",
            "5174",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Bitumen primer",
    "category": "Insulators",
    "subcategory": "Water Proofing",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FPrimer-24-size_500_500.webp&w=750&q=75",
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
        },
        {
          "label": "Is installation required?",
          "type": "select",
          "options": [
            "false",
            "true"
          ],
          "required": false
        },
        {
          "label": "What are the desired specification for this product ?",
          "type": "select",
          "options": [
            "5730",
            "5733",
            "5734",
            "5744",
            "5745",
            "5747",
            "5749",
            "5750",
            "5751",
            "5752",
            "5753",
            "5754",
            "5755",
            "5761",
            "5762",
            "5763",
            "5764",
            "5767",
            "5768",
            "5769",
            "5770",
            "5771",
            "5773",
            "5775",
            "5779",
            "5782",
            "5783",
            "5784",
            "5805",
            "5806",
            "5807",
            "5808",
            "5825",
            "5826",
            "5828",
            "5829",
            "5830",
            "5832",
            "5833",
            "5834",
            "5838",
            "5840",
            "5146",
            "5167",
            "5138",
            "5139",
            "5823",
            "5824",
            "5852",
            "5174",
            "custom",
            "Other"
          ],
          "required": false
        }
      ]
    }
  },
  {
    "title": "Float valves",
    "category": "Plumbing",
    "subcategory": "Control Valves",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FFOOT%2520VALVE.jpg&w=750&q=75",
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
    "title": "Strip Light",
    "category": "Electrical",
    "subcategory": "Lights & Bulbs",
    "image_url": "https://staging.watad.vip/_next/image?url=https%3A%2F%2Fwatad-staging-bucket.s3.eu-west-3.amazonaws.com%2FStrip%2520Light.jpg&w=750&q=75",
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
]

3. Response Format:
{
  "responseType": "order_collection" | "order_confirmation" | "final_order",
  "text": "Conversational response to user",
  "currentStep": "product_selection" | "quantity" | "delivery" | "customer_info" | "confirmation",
  "orderDetails": {
    "products": [
      {
        "name": "",
        "quantity": 0,
        "unit": "",
        "specifications": {} // Optional product-specific details
      }
    ],
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

      // Start chat session
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

      if (parsedResponse.orderDetails) {
        currentOrderState.orderDetails = {
          ...currentOrderState.orderDetails,
          ...parsedResponse.orderDetails
        };
      }

      currentOrderState.conversationHistory.push({ 
        role: "model", 
        parts: [{ text: responseText }] 
      });

      if (parsedResponse.responseType === "final_order") {
        const products = currentOrderState.orderDetails.products.map(product => {
          // Merge existing specifications with additional parsed details dynamically
          const specifications = {
            ...(product.specifications || {}),
          };
      
          // Dynamically add more details from parsed response text
          const productText = parsedResponse.text
            .split('\n')
            .find(line => line.includes(product.name));
      
          if (productText) {
            // Add any key-value pairs found in the product text
            productText.split(',').forEach(detail => {
              const [key, value] = detail.split(':').map(str => str.trim());
              if (key && value) specifications[key] = value;
            });
          }
      
          return {
            name: product.name,
            quantity: product.quantity,
            unit: product.unit || '',
            specifications,
            price: 0, // Optional: Add pricing logic
          };
        });
      
        // Create the new order
        const newOrder = new Order({
          userId: req.session?.userId || 'anonymous',
          products: products,
          totalAmount: 0, // Optionally calculate price
          status: 'pending',
          customerName: currentOrderState.orderDetails.customerInfo.name,
          customerPhone: currentOrderState.orderDetails.customerInfo.phone,
          customerAddress: currentOrderState.orderDetails.customerInfo.address,
        });
      
        const savedOrder = await newOrder.save();
      
        // Reset order state
        currentOrderState = { orderDetails: {}, conversationHistory: [] };
      
        return res.status(200).json({
          response: parsedResponse.text,
          orderId: savedOrder._id,
          orderSummary: savedOrder.products, // Optionally format a summary
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
