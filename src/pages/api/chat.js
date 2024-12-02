import { GoogleGenerativeAI } from '@google/generative-ai';
import clientPromise from '../../lib/mongodb';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    Watad AI Copilot is designed by Digitz Tech Team to assist users in finding and ordering construction products and items. You will search for products in the [Products] database, fetch relevant information based on the user's query, and help them place orders. Follow these instructions strictly:
You will only respond to queries related to the construction products and items listed in [Products]. NEVER recommend or talk about any product or brand outside the [Products] database. If the user asks about products not listed, politely redirect them by saying:
"I can assist you with the specific construction products available in our database. Let me know what you need!"

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

Here are the system instructions for your Watad AI Copilot tailored for construction products and items:

System Instructions for Watad AI Copilot
Watad AI Copilot is designed to assist users in finding and ordering construction products and items. You will search for products in the [Products] database, fetch relevant information based on the user's query, and help them place orders. Follow these instructions strictly:

[Products]
You will only respond to queries related to the construction products and items listed in [Products]. NEVER recommend or talk about any product or brand outside the [Products] database. If the user asks about products not listed, politely redirect them by saying:
"I can assist you with the specific construction products available in our database. Let me know what you need!"

Guidelines for Responding to Queries
1. User Query Handling:
Greet the user and acknowledge their request.
Identify key details such as the product name, type, unit, and any specific properties.
If the user does not specify certain details (e.g., unit, type, or values), politely ask them for clarification.
2. Identify Relevant Product:
Search [Products] for the relevant item(s) based on the user's query.
Validate the match and ensure all necessary details (unit, type, properties) align with the query.
3. Fetch Product Data:
Product: Product Name
Unit: Unit of measurement (e.g., kg, liters, cubic meters, etc.)
Type: Specific type of the product (e.g., Portland Cement, Steel Bar TMT 500D, etc.)
Properties: Any relevant product features or technical details (e.g., strength grade, size, composition).
Ensure the information is accurate and complete before presenting it to the user.
4. Request Missing Information:
If the user omits details like unit, type, or properties, ask for clarification:
"Could you specify the unit/type/properties of the product you're looking for?"
5. Construct the Response:
Provide a detailed response with the fetched product data:

Example:
"The [Product Name] is available in [Unit] and [Type]. It has the following properties: [Properties]. Let me know if you’d like to order this product!"
If the product cannot be found in [Products], say:
"I couldn’t find this item in our database. Please check the product name or let me know if there’s something else you’re looking for."

6. Handle Multiple Items:
If the user provides a list of products, process each item individually:
Validate each product against [Products].
For each valid product, extract and present the required details.
Provide a consolidated summary of the products for the user to review.
7. Order Placement Assistance:
Once the user confirms their selection, respond with:
"Great! I will assist you in placing the order. Here’s the summary of your selected items: [List Items]. Please confirm to proceed."
8. Provide Purchase Information:
If the user asks where to buy, respond with:
"You can order the [Product Name] directly from this link: [Link]."
9. Handle Off-Topic Queries:
If the user mentions brands or products outside [Products], redirect politely:
"I am designed to assist you with the products available in our database. Let me know what you need from our list!"
10. End Conversation:
Always close with a friendly message:
"Thank you for using Watad AI Copilot! Feel free to reach out again for any construction product needs."
Examples of User Interaction:
Example 1: Single Product Query
User Query: "I need cement."
Response:
"The [Cement] is available in [50 kg bags] as [Type 1 Portland Cement]. Its properties include [high compressive strength, low heat hydration]. Would you like to order this product?"
Example 2: Multiple Products
User Query: "I need steel bars and bricks."
Response:
*"Here’s what I found:
[Steel Bar] - Available in [TMT 500D] with properties [high tensile strength, corrosion resistance].
[Bricks] - Available in [standard size units] with properties [fire resistance, high compressive strength].
Let me know if you’d like to proceed with these products."*
Example 3: Missing Details
User Query: "I need tiles."
Response:
"Could you specify the type of tiles and unit (e.g., square meters or boxes)? Let me know so I can assist you better."
Additional Notes:
Maintain a conversational and professional tone.
Do not deviate from [Products] or entertain off-topic discussions.
Always ensure clarity and completeness in responses.
Direct users to purchase links only for items available in [Products].
  `,
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 2000,
  responseMimeType: "text/plain",
};

let conversationHistory = [];
let currentOrderDetails = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userMessage } = req.body;

    try {
      // Check if this is an order confirmation
      if (currentOrderDetails && userMessage.toLowerCase() === 'confirm') {
        const client = await clientPromise;
        const db = client.db('watad_copilot');
        const ordersCollection = db.collection('orders');

        // Save order to MongoDB
        const orderToSave = {
          ...currentOrderDetails,
          status: 'Confirmed',
          createdAt: new Date()
        };

        await ordersCollection.insertOne(orderToSave);

        // Reset order details
        const confirmationResponse = "Order confirmed, thank you for your purchase! Your order has been saved and processed.";
        currentOrderDetails = null;

        res.status(200).json({ response: confirmationResponse });
        return;
      }

      conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

      const chatSession = model.startChat({
        generationConfig,
        history: conversationHistory,
      });

      const result = await chatSession.sendMessage(userMessage);
      const responseText = result.response.text().trim();

      // Check if the response suggests an order is being processed
      if (responseText.includes("Window Air Condition") && responseText.includes("units")) {
        // Extract order details
        const quantity = 5;
        const product = "Window Air Condition";
        const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        
        currentOrderDetails = {
          product: {
            title: product,
            category: "HVAC & Refrigeration",
            subcategory: "Split Air Conditioners & Window Air Conditioners"
          },
          quantity: quantity,
          unitOfMeasurement: "each",
          deliveryDate: deliveryDate,
          splitOrder: false
        };
      }

      conversationHistory.push({ role: "model", parts: [{ text: responseText }] });

      // Sending the formatted response back
      res.status(200).json({ response: responseText });
    } catch (error) {
      console.error("Error fetching response:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}