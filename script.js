// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Form submission
    document.getElementById('healthForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateHealthReport();
    });
});

// Blood type traits data (for informational purposes only)
const bloodTypeTraits = {
    'A+': { 
        traits: ['Methodical', 'Cooperative', 'Orderly'],
        dietTip: 'May respond well to vegetarian diet with fish occasionally',
        compatible: ['A+', 'A-', 'O+', 'O-']
    },
    'A-': { 
        traits: ['Creative', 'Sensitive', 'Perfectionist'],
        dietTip: 'Consider plant-based foods with lean protein',
        compatible: ['A-', 'O-']
    },
    'B+': { 
        traits: ['Flexible', 'Creative', 'Individualistic'],
        dietTip: 'Balanced omnivore diet often works well',
        compatible: ['B+', 'B-', 'O+', 'O-']
    },
    'B-': { 
        traits: ['Independent', 'Strong-minded', 'Practical'],
        dietTip: 'Can handle dairy better than some blood types',
        compatible: ['B-', 'O-']
    },
    'AB+': { 
        traits: ['Rational', 'Calm', 'Adaptable'],
        dietTip: 'Most flexible diet - mix of A and B type recommendations',
        compatible: ['All blood types']
    },
    'AB-': { 
        traits: ['Charismatic', 'Spiritual', 'Complex'],
        dietTip: 'Moderate portions of varied foods work best',
        compatible: ['AB-', 'A-', 'B-', 'O-']
    },
    'O+': { 
        traits: ['Confident', 'Strong leadership', 'Energetic'],
        dietTip: 'High-protein diet with lean meats often suitable',
        compatible: ['O+', 'O-']
    },
    'O-': { 
        traits: ['Robust', 'Focused', 'Natural leaders'],
        dietTip: 'Lean proteins and vegetables work well',
        compatible: ['O-']
    }
};

// Activity multipliers for calorie calculation
const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9
};

// Diet recommendations
const dietSuggestions = {
    balanced: ['Whole grains', 'Lean proteins', 'Fruits & vegetables', 'Healthy fats'],
    vegetarian: ['Legumes', 'Tofu/Tempeh', 'Nuts & seeds', 'Dairy/Eggs', 'Whole grains'],
    vegan: ['Legumes', 'Tofu/Tempeh', 'Nuts & seeds', 'Whole grains', 'Fortified plant milk'],
    keto: ['Healthy fats', 'Non-starchy vegetables', 'Protein in moderation', 'Low-carb fruits'],
    mediterranean: ['Olive oil', 'Fish', 'Whole grains', 'Vegetables', 'Nuts'],
    pescatarian: ['Fish & seafood', 'Plant proteins', 'Dairy', 'Whole grains', 'Vegetables']
};

// Exercise recommendations by goal
const exerciseRecommendations = {
    lose: ['Cardio 4-5x/week (30-45 min)', 'Strength training 3x/week', 'HIIT workouts 2x/week'],
    maintain: ['Cardio 3-4x/week', 'Strength training 2-3x/week', 'Flexibility exercises'],
    gain: ['Strength training 4-5x/week', 'Compound movements', 'Adequate rest between sessions'],
    fitness: ['Varied workouts', 'Progressive overload', 'Include recovery days']
};

// Generate Health Report
function generateHealthReport() {
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const bloodType = document.getElementById('bloodType').value;
    const activity = document.getElementById('activity').value;
    const diet = document.getElementById('diet').value;
    const goal = document.getElementById('goal').value;
    
    // Validate inputs
    if (!age || !gender || !weight || !height || !bloodType || !activity || !diet || !goal) {
        alert('Please fill all fields');
        return;
    }
    
    // Calculate metrics
    const heightM = height / 100;
    const bmi = calculateBMI(weight, heightM);
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR(weight, height, age, gender);
    const dailyCalories = Math.round(bmr * activityMultipliers[activity]);
    
    // Get blood type info
    const bloodInfo = bloodTypeTraits[bloodType];
    
    // Get recommendations
    const dietRecs = dietSuggestions[diet] || [];
    const exerciseRecs = exerciseRecommendations[goal] || [];
    
    // Calculate ideal weight range
    const idealMin = Math.round(18.5 * heightM * heightM);
    const idealMax = Math.round(24.9 * heightM * heightM);
    
    // Update report date
    document.getElementById('reportDate').textContent = new Date().toLocaleString();
    
    // Generate results HTML
    const resultsHTML = `
        <div class="results-content">
            <div class="health-metrics">
                <div class="metric-card ${getBMIClass(bmiCategory)}">
                    <div class="metric-label">BMI</div>
                    <div class="metric-value">${bmi.toFixed(1)}</div>
                    <div class="metric-category">${bmiCategory}</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-label">BMR</div>
                    <div class="metric-value">${Math.round(bmr)}</div>
                    <div class="metric-category">Calories/day at rest</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-label">Daily Needs</div>
                    <div class="metric-value">${dailyCalories}</div>
                    <div class="metric-category">Calories for ${activity} activity</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-label">Ideal Weight</div>
                    <div class="metric-value">${idealMin}-${idealMax}</div>
                    <div class="metric-category">Kilograms (range)</div>
                </div>
            </div>
            
            <div class="blood-type-info">
                <h4><i class="fas fa-tint"></i> Blood Type ${bloodType} Profile</h4>
                <p><strong>Common Traits:</strong> ${bloodInfo.traits.join(', ')}</p>
                <p><strong>Diet Tip:</strong> ${bloodInfo.dietTip}</p>
                <p><strong>Compatible for donation:</strong> ${bloodInfo.compatible.join(', ')}</p>
                <p class="small-note"><em>Note: Blood type personality/diet theories are not scientifically proven.</em></p>
            </div>
            
            <div class="recommendations">
                <h3><i class="fas fa-lightbulb"></i> Personalized Recommendations</h3>
                
                <div class="recommendation-category">
                    <h4><i class="fas fa-utensils"></i> Diet Suggestions (${diet})</h4>
                    <ul class="recommendation-list">
                        ${dietRecs.map(item => `<li>${item}</li>`).join('')}
                        <li>Stay hydrated with 8-10 glasses of water daily</li>
                        <li>Limit processed foods and added sugars</li>
                    </ul>
                </div>
                
                <div class="recommendation-category">
                    <h4><i class="fas fa-running"></i> Exercise Plan (${getGoalText(goal)})</h4>
                    <ul class="recommendation-list">
                        ${exerciseRecs.map(item => `<li>${item}</li>`).join('')}
                        <li>Always warm up for 5-10 minutes before exercise</li>
                        <li>Listen to your body and rest when needed</li>
                    </ul>
                </div>
                
                <div class="recommendation-category">
                    <h4><i class="fas fa-heart"></i> General Health Tips</h4>
                    <ul class="recommendation-list">
                        <li>Sleep 7-9 hours per night for optimal recovery</li>
                        <li>Manage stress through meditation or mindfulness</li>
                        <li>Get regular health check-ups based on your age</li>
                        <li>${age > 40 ? 'Consider regular cardiovascular screening' : 'Maintain these healthy habits as you age'}</li>
                    </ul>
                </div>
                
                ${bmiCategory === 'Overweight' || bmiCategory === 'Obese' ? `
                <div class="recommendation-category warning">
                    <h4><i class="fas fa-exclamation-circle"></i> Weight Management</h4>
                    <ul class="recommendation-list">
                        <li>Aim to lose 0.5-1 kg per week for sustainable results</li>
                        <li>Create a calorie deficit of 500-750 calories daily</li>
                        <li>Focus on portion control and mindful eating</li>
                    </ul>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Display results
    document.getElementById('results').innerHTML = resultsHTML;
    document.getElementById('results').classList.remove('results-placeholder');
}

// Helper Functions
function calculateBMI(weightKg, heightM) {
    return weightKg / (heightM * heightM);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function getBMIClass(category) {
    const classes = {
        'Underweight': 'bmi-underweight',
        'Normal': 'bmi-normal',
        'Overweight': 'bmi-overweight',
        'Obese': 'bmi-obese'
    };
    return classes[category] || '';
}

function calculateBMR(weightKg, heightCm, age, gender) {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
        return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
}

function getGoalText(goal) {
    const goalMap = {
        'lose': 'Weight Loss',
        'maintain': 'Weight Maintenance',
        'gain': 'Muscle Gain',
        'fitness': 'General Fitness'
    };
    return goalMap[goal] || goal;
}

// Add sample data button for testing (optional)
function loadSampleData() {
    document.getElementById('age').value = 30;
    document.getElementById('gender').value = 'male';
    document.getElementById('weight').value = 75;
    document.getElementById('height').value = 175;
    document.getElementById('bloodType').value = 'O+';
    document.getElementById('activity').value = 'moderate';
    document.getElementById('diet').value = 'balanced';
    document.getElementById('goal').value = 'fitness';
}
