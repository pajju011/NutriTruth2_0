from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/ocr', methods=['POST'])
def extract_text():
    """Extract text from product image"""
    data = request.json
    image_url = data.get('image_url')
    
    if not image_url:
        return jsonify({'error': 'image_url required'}), 400
    
    # TODO: Implement actual OCR using pytesseract or cloud service
    extracted_text = "Sample extracted text from product label"
    
    return jsonify({
        'text': extracted_text,
        'confidence': 0.95
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
