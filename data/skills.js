// Comprehensive list of skills organized by categories
export const skillsData = {
  // Programming Languages
  programming: [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
    "Swift", "Kotlin", "Dart", "Scala", "R", "MATLAB", "Perl", "Objective-C", "VB.NET", "F#"
  ],
  
  // Web Development
  webDevelopment: [
    "React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Node.js", "Express.js", "Django",
    "Flask", "Laravel", "Spring Boot", "ASP.NET", "HTML5", "CSS3", "SASS", "LESS",
    "Bootstrap", "Tailwind CSS", "jQuery", "Webpack", "Vite"
  ],
  
  // Mobile Development
  mobile: [
    "React Native", "Flutter", "iOS Development", "Android Development", "Xamarin",
    "Cordova", "Ionic", "Unity", "SwiftUI", "Jetpack Compose"
  ],
  
  // Databases
  databases: [
    "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis", "Oracle", "SQL Server",
    "DynamoDB", "Cassandra", "Neo4j", "Firebase", "Supabase"
  ],
  
  // Cloud & DevOps
  cloudDevOps: [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitLab CI",
    "GitHub Actions", "Terraform", "Ansible", "Chef", "Puppet", "Nginx", "Apache"
  ],
  
  // Data Science & AI
  dataScience: [
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "Apache Spark", "Hadoop",
    "Power BI", "Tableau", "Data Analysis", "Statistics", "NLP", "Computer Vision"
  ],
  
  // Design & UI/UX
  design: [
    "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
    "InDesign", "Canva", "Wireframing", "Prototyping", "User Research", "Design Systems"
  ],
  
  // Business & Management
  business: [
    "Project Management", "Agile", "Scrum", "Kanban", "Product Management",
    "Business Analysis", "Strategic Planning", "Leadership", "Team Management",
    "Communication", "Presentation Skills", "Negotiation", "Problem Solving"
  ],
  
  // Marketing & Sales
  marketing: [
    "Digital Marketing", "SEO", "SEM", "Social Media Marketing", "Content Marketing",
    "Email Marketing", "Google Analytics", "Facebook Ads", "Google Ads", "CRM",
    "Sales Funnel", "Lead Generation", "Market Research"
  ],
  
  // Finance & Accounting
  finance: [
    "Financial Analysis", "Accounting", "Excel", "QuickBooks", "SAP", "Financial Modeling",
    "Budgeting", "Forecasting", "Risk Management", "Investment Analysis", "Taxation"
  ],
  
  // Other Technical Skills
  other: [
    "Git", "Linux", "Windows Server", "Cybersecurity", "Network Administration",
    "API Development", "Microservices", "GraphQL", "REST APIs", "Testing", "QA",
    "Automation", "Blockchain", "IoT", "AR/VR"
  ]
};

// Flatten all skills into a single searchable array
export const allSkills = Object.values(skillsData).flat().sort();

// Get skills by category
export const getSkillsByCategory = (category) => {
  return skillsData[category] || [];
};

// Search skills function
export const searchSkills = (query, limit = 10) => {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  return allSkills
    .filter(skill => skill.toLowerCase().includes(normalizedQuery))
    .slice(0, limit);
};

// Get popular skills (most commonly used)
export const popularSkills = [
  "JavaScript", "Python", "React", "Node.js", "HTML5", "CSS3", "Java", "TypeScript",
  "AWS", "Docker", "Git", "MySQL", "MongoDB", "Express.js", "Vue.js", "Angular",
  "Machine Learning", "Data Analysis", "Project Management", "Communication",
  "Problem Solving", "Leadership", "Agile", "Scrum"
];
