// ==== script.js ====

function predict() {
    const cgpa = document.getElementById('cgpa').value;
    const backlogs = document.getElementById('backlogs').value;
    const projects = document.getElementById('projects').value;
    const internships = document.getElementById('internships').value;
    const coding = document.getElementById('coding').value;
    const resultDiv = document.getElementById('prediction-result');

    if (!cgpa || !projects || !internships || !backlogs || !coding) {
        resultDiv.innerHTML = '<p style="color: #f87171; font-weight: bold;">Please fill in all fields.</p>';
        resultDiv.style.borderLeftColor = "#ef4444";
        resultDiv.style.background = "rgba(239, 68, 68, 0.1)";
        resultDiv.style.display = 'block';
        return;
    }

    // Advanced Mock Logic
    let baseScore = (parseFloat(cgpa) * 8.5); // Max 85 from CGPA
    let projScore = Math.min(parseInt(projects) * 3, 15); // Max 15 from projects
    let internScore = Math.min(parseInt(internships) * 5, 10); // Max 10 from internships
    
    // Penalties for backlogs
    let backlogPenalty = parseInt(backlogs) * 15;
    
    // Bonus for coding
    let codingBonus = 0;
    if (coding === 'intermediate') codingBonus = 5;
    if (coding === 'advanced') codingBonus = 12;

    let score = baseScore + projScore + internScore - backlogPenalty + codingBonus;
    
    // Cap probability
    let probability = Math.min(Math.max(score, 5), 98.7); 

    let color = "#4ade80"; // Bright Green
    let bg = "rgba(74, 222, 128, 0.1)";
    let message = "Excellent Profile! You have a very high chance of securing a top-tier placement.";
    
    if (probability < 50) {
        color = "#f87171";
        bg = "rgba(248, 113, 113, 0.1)";
        message = "High Risk. Focus heavily on clearing backlogs and building core skills immediately.";
    } else if (probability < 75) {
        color = "#fbbf24";
        bg = "rgba(251, 191, 36, 0.1)";
        message = "Fair Chances. Improving your coding profile and adding a project could bump you into the safe zone.";
    }

    resultDiv.style.borderLeftColor = color;
    resultDiv.style.background = bg;
    resultDiv.innerHTML = `
        <h3 style="color: ${color}; margin-bottom: 0.5rem; font-size: 1.5rem;">Prediction Complete</h3>
        <p style="font-size: 1.2rem; margin-bottom: 0.75rem; color: var(--text-main);">Estimated Placement Probability: <strong style="color: ${color}; font-size: 2rem; display: block; margin-top: 0.5rem;">${probability.toFixed(1)}%</strong></p>
        <p style="font-size: 0.95rem; margin-top: 15px; color: var(--text-muted); line-height: 1.5;"><strong>AI Insight:</strong> ${message}</p>
    `;
    
    // Save metric to localStorage for Dashboard wiring
    let stats = JSON.parse(localStorage.getItem('sps_stats')) || {};
    stats.probability = probability.toFixed(1);
    stats.projects = projects;
    localStorage.setItem('sps_stats', JSON.stringify(stats));

    resultDiv.style.display = 'block';
}

// ==== Dynamic Data Flow Logic ====

function registerUser(event) {
    event.preventDefault(); // Stop default form submission
    
    // Grab details
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const college = document.getElementById('college').value;
    const year = document.getElementById('year').value;
    const branch = document.getElementById('branch').value;
    
    // Simple validation
    if(!fname || !lname || !email || !college || !year || !branch) {
        alert("Please fill in all required fields.");
        return;
    }
    
    // Save to localStorage
    const userData = {
        firstName: fname,
        lastName: lname,
        email: email,
        college: college,
        gradYear: year,
        branch: document.getElementById('branch').options[document.getElementById('branch').selectedIndex].text,
        initials: fname.charAt(0).toUpperCase() + lname.charAt(0).toUpperCase()
    };
    
    localStorage.setItem('sps_user', JSON.stringify(userData));
    
    // Redirect to Dashboard
    window.location.href = 'dashboard.html';
}

function loadDashboardDetails() {
    // Only run if we are on the dashboard
    if(document.querySelector('.dashboard-container')) {
        
        // 1. Load User Profile
        const userDataStr = localStorage.getItem('sps_user');
        if(userDataStr) {
            const user = JSON.parse(userDataStr);
            const nameSpan = document.querySelector('.dashboard-header h1 span');
            if(nameSpan) nameSpan.textContent = user.firstName + " " + user.lastName;
            const subtext = document.querySelector('.dashboard-header p');
            if(subtext) subtext.textContent = `${user.branch} - ${user.gradYear} Batch | ${user.college}`;
            const avatar = document.querySelector('.dashboard-header .avatar');
            if(avatar) avatar.textContent = user.initials;
        }

        // 2. Load Real Dynamic Stats
        const statsStr = localStorage.getItem('sps_stats');
        if(statsStr) {
            const stats = JSON.parse(statsStr);
            
            if(stats.probability) {
                document.getElementById('dash-prob').textContent = stats.probability + '%';
                const trend = document.getElementById('dash-prob-trend');
                trend.textContent = stats.probability > 75 ? '↑ High Chance' : (stats.probability > 50 ? '− Moderate Chance' : '↓ Action Required');
                trend.style.color = stats.probability > 75 ? '#4ade80' : (stats.probability > 50 ? '#fbbf24' : '#f87171');
            }
            if(stats.projects) {
                document.getElementById('dash-proj').textContent = stats.projects;
            }
            if(stats.skillsVal !== undefined) {
                document.getElementById('dash-skills').textContent = stats.skillsVal;
            }
            if(stats.missingVal !== undefined) {
                document.getElementById('dash-missing').textContent = stats.missingVal;
                if(stats.missingVal === 0) {
                    document.getElementById('dash-missing-trend').textContent = 'Perfect Match!';
                    document.getElementById('dash-missing-trend').style.color = '#4ade80';
                } else {
                    document.getElementById('dash-missing-trend').textContent = 'Action Required';
                    document.getElementById('dash-missing-trend').style.color = '#f59e0b';
                }
            }
        }
    }
}

// Run loader on DOM Load
document.addEventListener('DOMContentLoaded', loadDashboardDetails);

function analyze() {
    const role = document.getElementById('role').value;
    const skillsInput = document.getElementById('current-skills').value.toLowerCase();
    const resultDiv = document.getElementById('analyzer-result');

    if (!role || !skillsInput) {
        resultDiv.innerHTML = '<p style="color: #f87171; font-weight: bold;">Please select a role and enter your skills.</p>';
        resultDiv.style.borderLeftColor = "#ef4444";
        resultDiv.style.background = "rgba(239, 68, 68, 0.1)";
        resultDiv.style.display = 'block';
        return;
    }

    const requirements = {
        frontend: ['html', 'css', 'javascript', 'react', 'git', 'responsive design'],
        backend: ['java', 'spring boot', 'sql', 'mysql', 'api', 'git'],
        data: ['python', 'sql', 'machine learning', 'statistics', 'pandas'],
        devops: ['linux', 'docker', 'aws', 'ci/cd', 'git', 'kubernetes'],
        mobile: ['java', 'kotlin', 'swift', 'react native', 'git', 'api']
    };

    const targetSkills = requirements[role];
    const userSkills = skillsInput.split(',').map(s => s.trim());
    
    // Find missing skills
    const missingSkills = targetSkills.filter(skill => !userSkills.some(s => s.includes(skill)));

    let roleName = document.getElementById('role').options[document.getElementById('role').selectedIndex].text;

    if (missingSkills.length === 0) {
        resultDiv.style.borderLeftColor = "#4ade80"; // Green
        resultDiv.style.background = "rgba(74, 222, 128, 0.1)";
        resultDiv.innerHTML = `
            <h3 style="color: #4ade80; margin-bottom: 0.5rem; font-size: 1.4rem;">Great Job!</h3>
            <p style="color: var(--text-main); font-size: 1.1rem;">You seem to have the core skills needed for a <strong>${roleName}</strong> role.</p>
        `;
    } else {
        resultDiv.style.borderLeftColor = "#f87171"; // Red
        resultDiv.style.background = "rgba(248, 113, 113, 0.1)";
        resultDiv.innerHTML = `
            <h3 style="color: #f87171; margin-bottom: 0.5rem; font-size: 1.4rem;">Action Required</h3>
            <p style="color: var(--text-main); margin-bottom: 1rem;">To improve your chances for a <strong>${roleName}</strong> role, you are missing these critical skills:</p>
            <ul style="margin-top: 10px; margin-left: 20px; color: #f87171; font-weight: 700; text-align: left; background: rgba(0,0,0,0.2); padding: 1.5rem 1.5rem 1.5rem 3rem; border-radius: 8px; border: 1px solid rgba(248, 113, 113, 0.2);">
                ${missingSkills.map(s => `<li>${s.charAt(0).toUpperCase() + s.slice(1)}</li>`).join('')}
            </ul>
        `;
    }
    
    // Save metric to localStorage for Dashboard wiring
    let stats = JSON.parse(localStorage.getItem('sps_stats')) || {};
    stats.missingVal = missingSkills.length;
    stats.skillsVal = userSkills.length;
    localStorage.setItem('sps_stats', JSON.stringify(stats));

    resultDiv.style.display = 'block';
}
