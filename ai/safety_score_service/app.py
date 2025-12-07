from flask import Flask, request, jsonify
import os
import re

app = Flask(__name__)

# Harmful ingredients database (based on FSSAI guidelines)
HARMFUL_INGREDIENTS = {
    'high_risk': {
        'msg': 'Monosodium Glutamate - Can cause headaches and allergic reactions',
        'aspartame': 'Artificial sweetener linked to health concerns',
        'sodium nitrite': 'Preservative linked to health risks',
        'bha': 'Butylated Hydroxyanisole - Potential carcinogen',
        'bht': 'Butylated Hydroxytoluene - Potential health risks',
        'sodium benzoate': 'Preservative that can form benzene',
        'potassium bromate': 'Banned in many countries, potential carcinogen',
        'artificial color': 'May cause hyperactivity in children',
        'tartrazine': 'Yellow dye linked to allergic reactions',
        'trans fat': 'Increases heart disease risk',
    },
    'medium_risk': {
        'palm oil': 'High in saturated fat, environmental concerns',
        'high fructose corn syrup': 'Linked to obesity and diabetes',
        'refined flour': 'Low nutritional value, spikes blood sugar',
        'maida': 'Refined wheat flour with low nutrition',
        'hydrogenated': 'Contains trans fats',
        'artificial flavor': 'Synthetic chemicals',
        'caramel color': 'May contain carcinogenic compounds',
    },
    'low_risk': {
        'sugar': 'Excess consumption linked to health issues',
        'salt': 'High sodium intake risks',
        'vegetable oil': 'Quality varies significantly',
    }
}

# FSSAI nutrition thresholds (per 100g)
NUTRITION_THRESHOLDS = {
    'sodium': {'high': 600, 'very_high': 1200},  # mg
    'sugar': {'high': 15, 'very_high': 22.5},     # g
    'fat': {'high': 17.5, 'very_high': 21},       # g
    'saturated_fat': {'high': 5, 'very_high': 6}, # g
}


def extract_nutrition_values(text):
    """Extract nutrition values from text"""
    values = {}
    
    patterns = {
        'sodium': r'sodium[:\s]*(\d+(?:\.\d+)?)\s*(?:mg)?',
        'sugar': r'sugar[:\s]*(\d+(?:\.\d+)?)\s*(?:g)?',
        'fat': r'(?:total\s*)?fat[:\s]*(\d+(?:\.\d+)?)\s*(?:g)?',
        'calories': r'calories?[:\s]*(\d+(?:\.\d+)?)',
        'protein': r'protein[:\s]*(\d+(?:\.\d+)?)\s*(?:g)?',
        'carbs': r'carb(?:ohydrate)?s?[:\s]*(\d+(?:\.\d+)?)\s*(?:g)?',
    }
    
    for nutrient, pattern in patterns.items():
        match = re.search(pattern, text.lower())
        if match:
            values[nutrient] = float(match.group(1))
    
    return values


def check_ingredients(text):
    """Check for harmful ingredients"""
    text_lower = text.lower()
    found = {'high_risk': [], 'medium_risk': [], 'low_risk': []}
    
    for risk_level, ingredients in HARMFUL_INGREDIENTS.items():
        for ingredient, warning in ingredients.items():
            if ingredient in text_lower:
                found[risk_level].append({
                    'ingredient': ingredient,
                    'warning': warning
                })
    
    return found


def calculate_nutrition_score(values):
    """Calculate score based on nutrition values"""
    score = 100
    warnings = []
    
    # Check sodium
    if values.get('sodium', 0) > NUTRITION_THRESHOLDS['sodium']['very_high']:
        score -= 25
        warnings.append(f"Very high sodium: {values['sodium']}mg per 100g")
    elif values.get('sodium', 0) > NUTRITION_THRESHOLDS['sodium']['high']:
        score -= 15
        warnings.append(f"High sodium: {values['sodium']}mg per 100g")
    
    # Check sugar
    if values.get('sugar', 0) > NUTRITION_THRESHOLDS['sugar']['very_high']:
        score -= 25
        warnings.append(f"Very high sugar: {values['sugar']}g per 100g")
    elif values.get('sugar', 0) > NUTRITION_THRESHOLDS['sugar']['high']:
        score -= 15
        warnings.append(f"High sugar: {values['sugar']}g per 100g")
    
    # Check fat
    if values.get('fat', 0) > NUTRITION_THRESHOLDS['fat']['very_high']:
        score -= 20
        warnings.append(f"Very high fat: {values['fat']}g per 100g")
    elif values.get('fat', 0) > NUTRITION_THRESHOLDS['fat']['high']:
        score -= 10
        warnings.append(f"High fat: {values['fat']}g per 100g")
    
    # Bonus for protein
    if values.get('protein', 0) > 15:
        score += 10
    
    return max(0, min(100, score)), warnings


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'safety_score_service',
        'harmful_ingredients_tracked': sum(len(v) for v in HARMFUL_INGREDIENTS.values())
    })


@app.route('/score', methods=['POST'])
def calculate_score():
    """Calculate comprehensive safety score for a product"""
    data = request.json
    text = data.get('text', '')
    ingredients = data.get('ingredients', [])
    nutrition = data.get('nutrition', {})
    claims = data.get('claims', [])

    # Combine all text for analysis
    full_text = text + ' ' + ' '.join(ingredients)
    
    # Start with base score
    score = 100
    warnings = []
    contradictions = []

    # 1. Check harmful ingredients
    harmful = check_ingredients(full_text)
    
    for item in harmful['high_risk']:
        score -= 15
        warnings.append(f"Contains {item['ingredient']}: {item['warning']}")
    
    for item in harmful['medium_risk']:
        score -= 8
        warnings.append(f"Contains {item['ingredient']}: {item['warning']}")
    
    for item in harmful['low_risk']:
        score -= 3

    # 2. Check nutrition values
    if nutrition:
        nutrition_values = nutrition
    else:
        nutrition_values = extract_nutrition_values(full_text)
    
    nutrition_score, nutrition_warnings = calculate_nutrition_score(nutrition_values)
    score = (score + nutrition_score) // 2
    warnings.extend(nutrition_warnings)

    # 3. Check claim contradictions
    if claims:
        misleading_claims = [c for c in claims if not c.get('verified', True)]
        score -= len(misleading_claims) * 10
        for claim in misleading_claims:
            contradictions.append(f"Claim '{claim.get('claim', 'Unknown')}' appears misleading")

    # Determine rating
    if score >= 70:
        rating = 'Good'
    elif score >= 50:
        rating = 'Fair'
    elif score >= 30:
        rating = 'Poor'
    else:
        rating = 'Avoid'

    return jsonify({
        'score': max(0, min(100, score)),
        'rating': rating,
        'warnings': warnings,
        'contradictions': contradictions,
        'harmful_ingredients': harmful,
        'nutrition_extracted': nutrition_values
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    app.run(host='0.0.0.0', port=port, debug=True)
