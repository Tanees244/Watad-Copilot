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