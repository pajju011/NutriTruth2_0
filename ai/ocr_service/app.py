from flask import Flask, request, jsonify
import os
import requests
from io import BytesIO

app = Flask(__name__)

# Try to import pytesseract, fallback to mock if not available
try:
    import pytesseract
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("Warning: pytesseract not installed. Using mock OCR.")


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'ocr_service',
        'ocr_available': OCR_AVAILABLE
    })


@app.route('/ocr', methods=['POST'])
def extract_text():
    """Extract text from product image"""
    data = request.json
    image_url = data.get('image_url')
    image_base64 = data.get('image_base64')

    if not image_url and not image_base64:
        return jsonify({'error': 'image_url or image_base64 required'}), 400

    try:
        if OCR_AVAILABLE:
            # Real OCR processing
            if image_url:
                response = requests.get(image_url, timeout=10)
                image = Image.open(BytesIO(response.content))
            else:
                import base64
                image_data = base64.b64decode(image_base64)
                image = Image.open(BytesIO(image_data))

            # Extract text using Tesseract
            extracted_text = pytesseract.image_to_string(image)
            confidence_data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
            
            # Calculate average confidence
            confidences = [int(c) for c in confidence_data['conf'] if int(c) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0

            return jsonify({
                'text': extracted_text.strip(),
                'confidence': round(avg_confidence / 100, 2),
                'word_count': len(extracted_text.split())
            })
        else:
            # Mock OCR for development
            mock_text = """
            NUTRITION FACTS
            Serving Size: 100g
            Calories: 250
            Total Fat: 12g
            Sodium: 480mg
            Total Carbs: 30g
            Sugar: 15g
            Protein: 8g
            
            INGREDIENTS: Wheat Flour, Sugar, Palm Oil, 
            Salt, Artificial Flavors, Preservatives (E211)
            
            100% NATURAL - NO ADDED PRESERVATIVES
            HEALTHY CHOICE - LOW FAT
            """
            return jsonify({
                'text': mock_text.strip(),
                'confidence': 0.92,
                'word_count': len(mock_text.split()),
                'mock': True
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
