# NutriTruth AI Microservices

Three Python Flask microservices for food analysis.

## Services

### 1. OCR Service (Port 5001)

Extracts text from product images using Tesseract OCR.

**Endpoint:** `POST /ocr`

```json
{
  "image_url": "https://example.com/image.jpg"
}
```

### 2. NLP Claim Service (Port 5002)

Detects misleading health claims in text.

**Endpoint:** `POST /analyze`

```json
{
  "text": "100% Natural product with no preservatives..."
}
```

### 3. Safety Score Service (Port 5003)

Calculates product safety score based on ingredients and nutrition.

**Endpoint:** `POST /score`

```json
{
  "text": "Ingredients: Sugar, Palm Oil...",
  "nutrition": { "sodium": 500, "sugar": 20 }
}
```

## Running Locally

### With Docker:

```bash
cd ai
docker-compose up --build
```

### Without Docker:

```bash
# Terminal 1 - OCR Service
cd ai/ocr_service
pip install -r requirements.txt
python app.py

# Terminal 2 - NLP Service
cd ai/nlp_claim_service
pip install -r requirements.txt
python app.py

# Terminal 3 - Safety Score Service
cd ai/safety_score_service
pip install -r requirements.txt
python app.py
```

## Health Checks

- OCR: http://localhost:5001/health
- NLP: http://localhost:5002/health
- Score: http://localhost:5003/health
