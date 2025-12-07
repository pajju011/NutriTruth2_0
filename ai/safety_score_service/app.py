from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/score', methods=['POST'])
def calculate_score():
    """Calculate safety score for a product"""
    data = request.json
    ingredients = data.get('ingredients', [])
    nutrition = data.get('nutrition', {})
    
    # Simple scoring algorithm
    score = 100
    
    # Deduct for high sugar
    if nutrition.get('sugar', 0) > 20:
        score -= 20
    
    # Deduct for high sodium
    if nutrition.get('sodium', 0) > 500:
        score -= 15
    
    # Deduct for artificial ingredients
    artificial_keywords = ['artificial', 'preservative', 'color', 'flavoring']
    for ingredient in ingredients:
        if any(kw in ingredient.lower() for kw in artificial_keywords):
            score -= 5
    
    score = max(0, min(100, score))
    
    return jsonify({
        'score': score,
        'rating': 'Good' if score >= 70 else 'Fair' if score >= 50 else 'Poor'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    app.run(host='0.0.0.0', port=port)
