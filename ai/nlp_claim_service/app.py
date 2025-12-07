from flask import Flask, request, jsonify
import os

app = Flask(__name__)

HEALTH_CLAIM_KEYWORDS = [
    'organic', 'natural', 'sugar-free', 'low-fat', 'high-protein',
    'gluten-free', 'non-gmo', 'keto', 'vegan', 'heart-healthy'
]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/analyze', methods=['POST'])
def analyze_claims():
    """Analyze text for health claims"""
    data = request.json
    text = data.get('text', '').lower()
    
    if not text:
        return jsonify({'error': 'text required'}), 400
    
    detected_claims = [kw for kw in HEALTH_CLAIM_KEYWORDS if kw in text]
    
    return jsonify({
        'claims': detected_claims,
        'claim_count': len(detected_claims),
        'text_length': len(text)
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port)
