from flask import Flask, request, jsonify
import os
import re

app = Flask(__name__)

# Health claim patterns and their issues
CLAIM_PATTERNS = {
    r'\b100%\s*natural\b': {
        'claim': '100% Natural',
        'check': lambda text: any(word in text.lower() for word in ['artificial', 'preservative', 'flavor']),
        'issue': 'Product contains artificial ingredients despite "natural" claim',
        'severity': 'high'
    },
    r'\bsugar[\s-]*free\b': {
        'claim': 'Sugar Free',
        'check': lambda text: any(word in text.lower() for word in ['sugar', 'maltodextrin', 'dextrose', 'fructose', 'sucrose']),
        'issue': 'Contains sugar or sugar substitutes that affect blood sugar',
        'severity': 'high'
    },
    r'\blow[\s-]*fat\b': {
        'claim': 'Low Fat',
        'check': lambda text: check_nutrition_value(text, 'fat', 10),
        'issue': 'Fat content may not meet low-fat standards (>3g per 100g)',
        'severity': 'medium'
    },
    r'\bhigh[\s-]*protein\b': {
        'claim': 'High Protein',
        'check': lambda text: check_nutrition_value(text, 'protein', 10, less_than=True),
        'issue': 'Protein content may not justify "high protein" claim',
        'severity': 'medium'
    },
    r'\bno[\s-]*preservatives?\b': {
        'claim': 'No Preservatives',
        'check': lambda text: any(word in text.lower() for word in ['preservative', 'e211', 'e202', 'sodium benzoate', 'potassium sorbate']),
        'issue': 'Contains preservatives despite claim',
        'severity': 'high'
    },
    r'\borganic\b': {
        'claim': 'Organic',
        'check': lambda text: not re.search(r'certified\s*organic|usda\s*organic|india\s*organic', text.lower()),
        'issue': 'No organic certification mentioned',
        'severity': 'medium'
    },
    r'\bhealthy\b': {
        'claim': 'Healthy',
        'check': lambda text: any(word in text.lower() for word in ['sugar', 'sodium', 'palm oil', 'artificial']),
        'issue': 'Contains ingredients that contradict "healthy" claim',
        'severity': 'medium'
    },
    r'\bheart[\s-]*healthy\b': {
        'claim': 'Heart Healthy',
        'check': lambda text: check_nutrition_value(text, 'sodium', 400),
        'issue': 'High sodium content contradicts heart-healthy claim',
        'severity': 'high'
    },
    r'\bno[\s-]*added[\s-]*sugar\b': {
        'claim': 'No Added Sugar',
        'check': lambda text: 'sugar' in get_ingredients_section(text).lower(),
        'issue': 'Sugar appears in ingredients list',
        'severity': 'high'
    },
    r'\bwhole[\s-]*grain\b': {
        'claim': 'Whole Grain',
        'check': lambda text: 'refined' in text.lower() or 'maida' in text.lower(),
        'issue': 'Contains refined flour despite whole grain claim',
        'severity': 'medium'
    }
}


def check_nutrition_value(text, nutrient, threshold, less_than=False):
    """Check if nutrition value exceeds threshold"""
    pattern = rf'{nutrient}[:\s]*(\d+(?:\.\d+)?)\s*(?:g|mg)?'
    match = re.search(pattern, text.lower())
    if match:
        value = float(match.group(1))
        if less_than:
            return value < threshold
        return value > threshold
    return False


def get_ingredients_section(text):
    """Extract ingredients section from text"""
    match = re.search(r'ingredients?[:\s]*(.*?)(?:nutrition|allergen|contains|$)', text.lower(), re.DOTALL)
    return match.group(1) if match else text


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'nlp_claim_service',
        'patterns_loaded': len(CLAIM_PATTERNS)
    })


@app.route('/analyze', methods=['POST'])
def analyze_claims():
    """Analyze text for misleading health claims"""
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'text required'}), 400

    detected_claims = []
    verified_claims = []

    for pattern, config in CLAIM_PATTERNS.items():
        if re.search(pattern, text, re.IGNORECASE):
            is_misleading = config['check'](text)
            
            claim_data = {
                'claim': config['claim'],
                'found': True,
                'verified': not is_misleading
            }
            
            if is_misleading:
                claim_data['issue'] = config['issue']
                claim_data['severity'] = config['severity']
                detected_claims.append(claim_data)
            else:
                verified_claims.append(claim_data)

    # Calculate overall risk
    high_risk = sum(1 for c in detected_claims if c.get('severity') == 'high')
    medium_risk = sum(1 for c in detected_claims if c.get('severity') == 'medium')
    
    risk_score = min(100, high_risk * 25 + medium_risk * 10)

    return jsonify({
        'claims': detected_claims,
        'verified_claims': verified_claims,
        'total_claims_found': len(detected_claims) + len(verified_claims),
        'misleading_count': len(detected_claims),
        'risk_score': risk_score
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)
