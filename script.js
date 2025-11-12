document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initQuiz();
    initAnimations();
});

function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
}

function initAnimations() {
    const stats = document.querySelectorAll('.stat-value[data-count]');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        animateCounter(stat, target);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.eco-card, .problem-card, .solution-item').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

function connectWallet() {
    const modal = document.getElementById('connectionModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('connectionModal');
    modal.classList.remove('active');
}

function connectAI() {
    const btn = document.querySelector('.btn-connect-wallet');
    const originalText = btn.textContent;
    
    btn.textContent = 'Connecting...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = 'Connected!';
        btn.style.background = 'var(--secondary)';
        
        const mainBtn = document.querySelector('.btn-connect');
        mainBtn.innerHTML = '<i class="fas fa-check"></i> AI Connected';
        mainBtn.style.background = 'var(--secondary)';
        
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 2000);
        }, 1000);
    }, 2000);
}

function exploreEcosystem() {
    scrollToSection('ecosystem');
}

function deploySolution() {
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deploying...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Deployed!';
        btn.style.background = 'var(--secondary)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
        }, 3000);
    }, 3000);
}

let currentQuestion = 0;
let userAnswers = [];
let quizPath = [];

const quizData = [
    {
        question: "Select your problem domain",
        options: [
            { 
                text: "🏥 Healthcare & Medicine", 
                value: "healthcare",
                icon: "fas fa-heartbeat"
            },
            { 
                text: "🎓 Education & Learning", 
                value: "education",
                icon: "fas fa-graduation-cap"
            },
            { 
                text: "🌱 Environment & Sustainability", 
                value: "environment",
                icon: "fas fa-leaf"
            },
            { 
                text: "💼 Business & Productivity", 
                value: "business",
                icon: "fas fa-briefcase"
            }
        ]
    },
    {
        question: "What specific challenge are you facing?",
        options: {
            healthcare: [
                { text: "Disease diagnosis and detection", value: "diagnosis" },
                { text: "Treatment personalization", value: "treatment" },
                { text: "Medical research", value: "research" }
            ],
            education: [
                { text: "Personalized learning", value: "personalization" },
                { text: "Skill development", value: "skills" },
                { text: "Educational content", value: "content" }
            ],
            environment: [
                { text: "Climate prediction", value: "climate" },
                { text: "Pollution monitoring", value: "pollution" },
                { text: "Resource management", value: "resources" }
            ],
            business: [
                { text: "Process automation", value: "automation" },
                { text: "Data analysis", value: "analytics" },
                { text: "Decision making", value: "decisions" }
            ]
        }
    },
    {
        question: "What's your main objective?",
        options: [
            { text: "Increase efficiency", value: "efficiency" },
            { text: "Improve accuracy", value: "accuracy" },
            { text: "Reduce costs", value: "cost" },
            { text: "Scale operations", value: "scale" }
        ]
    },
    {
        question: "Preferred implementation approach?",
        options: [
            { text: "Ready-to-use AI tools", value: "ready" },
            { text: "Custom AI development", value: "custom" },
            { text: "Hybrid solution", value: "hybrid" }
        ]
    }
];

const solutions = {
    healthcare_diagnosis_efficiency_ready: {
        title: "AI Medical Imaging Diagnosis",
        description: "Advanced computer vision for early disease detection with 99.2% accuracy and 70% faster diagnosis.",
        benefits: ["Early detection", "Reduced errors", "24/7 availability"],
        tools: ["TensorFlow", "PyTorch", "Medical AI APIs"],
        implementation: "Cloud-based AI service with quick deployment"
    }
};

function initQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizPath = [];
    showQuestion();
    updateProgress();
    updateNavigation();
}

function showQuestion() {
    const question = quizData[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    let options = question.options;
    
    if (currentQuestion > 0 && typeof options === 'object') {
        const path = quizPath.slice(0, currentQuestion).join('_');
        options = options[path] || question.options[userAnswers[currentQuestion - 1]] || question.options;
    }
    
    if (typeof options === 'object' && !Array.isArray(options)) {
        options = Object.values(options)[0];
    }
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'option-btn';
        optionElement.innerHTML = `
            ${option.icon ? `<i class="${option.icon}"></i>` : ''}
            <span>${option.text}</span>
        `;
        optionElement.onclick = () => selectOption(index, option.value);
        
        if (userAnswers[currentQuestion] === option.value) {
            optionElement.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionElement);
    });
}

function selectOption(index, value) {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedOption = document.querySelectorAll('.option-btn')[index];
    selectedOption.classList.add('selected');
    
    userAnswers[currentQuestion] = value;
    quizPath = [...userAnswers.slice(0, currentQuestion), value];
    
    updateNavigation();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentQuestion').textContent = currentQuestion + 1;
    
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index <= currentQuestion);
    });
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Find Solution' : 'Next Query';
    nextBtn.disabled = !userAnswers[currentQuestion];
}

function nextQuestion() {
    if (!userAnswers[currentQuestion]) return;
    
    if (currentQuestion === quizData.length - 1) {
        showResults();
    } else {
        currentQuestion++;
        showQuestion();
        updateProgress();
        updateNavigation();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        updateProgress();
        updateNavigation();
    }
}

function showResults() {
    const solutionKey = userAnswers.join('_');
    const solution = solutions[solutionKey] || getFallbackSolution();
    
    document.getElementById('recommendationContent').innerHTML = `
        <div class="solution-result">
            <h4>${solution.title}</h4>
            <p>${solution.description}</p>
            <div class="solution-features">
                <h5>Key Features:</h5>
                <ul>
                    ${solution.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
            <div class="solution-tools">
                <h5>Tools & Technologies:</h5>
                <div class="tools-list">
                    ${solution.tools.map(tool => `<span>${tool}</span>`).join('')}
                </div>
            </div>
            <div class="implementation">
                <h5>Implementation:</h5>
                <p>${solution.implementation}</p>
            </div>
        </div>
    `;
    
    document.querySelector('.quiz-content').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
}

function getFallbackSolution() {
    return {
        title: "AI-Powered Solution Framework",
        description: "Custom AI solution tailored to your specific needs and requirements.",
        benefits: ["Scalable architecture", "Real-time processing", "Continuous learning"],
        tools: ["Machine Learning", "Cloud AI", "Data Analytics"],
        implementation: "Phased implementation starting with pilot project"
    };
}

function restartQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizPath = [];
    
    document.getElementById('resultContainer').style.display = 'none';
    document.querySelector('.quiz-content').style.display = 'block';
    
    showQuestion();
    updateProgress();
    updateNavigation();
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});
document.addEventListener('click', function(event) {
    const modal = document.getElementById('connectionModal');
    if (event.target === modal) {
        closeModal();
    }
});