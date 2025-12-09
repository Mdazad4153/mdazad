const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Education = require('./models/Education');
const Project = require('./models/Project');
const Service = require('./models/Service');
const Certificate = require('./models/Certificate');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Admin.deleteMany({}),
            Profile.deleteMany({}),
            Skill.deleteMany({}),
            Education.deleteMany({}),
            Project.deleteMany({}),
            Service.deleteMany({}),
            Certificate.deleteMany({})
        ]);
        console.log('🗑️ Cleared existing data');

        // Create Admin
        const hashedPassword = await bcrypt.hash('Azad@4153', 10);
        await Admin.create({
            name: 'Md Azad Ansari',
            email: 'azad79900@gmail.com',
            password: hashedPassword
        });
        console.log('✅ Admin created: azad79900@gmail.com / Azad@4153');

        // Create Profile
        await Profile.create({
            name: 'Md Azad',
            fullName: 'Md Azad Ansari',
            title: 'Web Developer & Tech Enthusiast',
            bio: 'A passionate CSE student at Government Polytechnic Chhapra, skilled in AI tools, web development, and MS Office. ADCA & KYP certified.',
            about: 'Hi! I\'m Md Azad Ansari, a dedicated Computer Science & Engineering student at Government Polytechnic Chhapra, currently in my 4th semester.\n\nI have completed ADCA (Advance Diploma in Computer Application) and KYP (Kaushal Yuva Program) certification. I\'m proficient in various AI tools, Microsoft Office Suite, web development technologies, and more.\n\nMy goal is to become a skilled full-stack developer and leverage AI to build innovative solutions.',
            email: 'mdazadansari@example.com',
            phone: '+91 XXXXXXXXXX',
            address: 'Chhapra, Bihar, India',
            socialLinks: {
                github: 'https://github.com/mdazad',
                linkedin: 'https://linkedin.com/in/mdazad',
                twitter: 'https://twitter.com/mdazad',
                instagram: 'https://instagram.com/mdazad',
                facebook: 'https://facebook.com/mdazad',
                youtube: 'https://youtube.com/@mdazad',
                whatsapp: 'https://wa.me/91XXXXXXXXXX',
                telegram: 'https://t.me/mdazad'
            },
            typingTexts: ['Web Developer', 'CSE Student', 'AI Enthusiast', 'ADCA Certified', 'Tech Learner'],
            stats: {
                projectsCompleted: 15,
                yearsExperience: 2,
                certificatesEarned: 8
            }
        });
        console.log('✅ Profile created');

        // Create Skills - AI Tools
        const aiSkills = [
            { name: 'ChatGPT', category: 'ai', proficiency: 90, icon: 'robot', order: 1 },
            { name: 'Google Gemini', category: 'ai', proficiency: 85, icon: 'brain', order: 2 },
            { name: 'Claude AI', category: 'ai', proficiency: 80, icon: 'robot', order: 3 },
            { name: 'Midjourney', category: 'ai', proficiency: 75, icon: 'image', order: 4 },
            { name: 'Canva AI', category: 'ai', proficiency: 85, icon: 'palette', order: 5 },
            { name: 'GitHub Copilot', category: 'ai', proficiency: 80, icon: 'github', order: 6 },
        ];

        // Microsoft Office Skills
        const officeSkills = [
            { name: 'MS Word', category: 'office', proficiency: 95, icon: 'file-word', order: 1 },
            { name: 'MS Excel', category: 'office', proficiency: 90, icon: 'file-excel', order: 2 },
            { name: 'MS PowerPoint', category: 'office', proficiency: 92, icon: 'file-powerpoint', order: 3 },
            { name: 'MS Access', category: 'office', proficiency: 75, icon: 'database', order: 4 },
            { name: 'MS Outlook', category: 'office', proficiency: 85, icon: 'envelope', order: 5 },
            { name: 'Google Docs', category: 'office', proficiency: 90, icon: 'file-alt', order: 6 },
            { name: 'Google Sheets', category: 'office', proficiency: 88, icon: 'table', order: 7 },
        ];

        // Frontend Skills
        const frontendSkills = [
            { name: 'HTML5', category: 'frontend', proficiency: 90, icon: 'html5', order: 1 },
            { name: 'CSS3', category: 'frontend', proficiency: 85, icon: 'css3', order: 2 },
            { name: 'JavaScript', category: 'frontend', proficiency: 80, icon: 'javascript', order: 3 },
            { name: 'React.js', category: 'frontend', proficiency: 70, icon: 'react', order: 4 },
            { name: 'Bootstrap', category: 'frontend', proficiency: 85, icon: 'bootstrap', order: 5 },
            { name: 'Tailwind CSS', category: 'frontend', proficiency: 75, icon: 'css3', order: 6 },
        ];

        // Backend Skills
        const backendSkills = [
            { name: 'Node.js', category: 'backend', proficiency: 75, icon: 'nodejs', order: 1 },
            { name: 'Express.js', category: 'backend', proficiency: 70, icon: 'nodejs', order: 2 },
            { name: 'MongoDB', category: 'backend', proficiency: 75, icon: 'database', order: 3 },
            { name: 'MySQL', category: 'backend', proficiency: 70, icon: 'database', order: 4 },
            { name: 'PHP', category: 'backend', proficiency: 65, icon: 'php', order: 5 },
        ];

        // Tools & Other Skills
        const toolSkills = [
            { name: 'Git & GitHub', category: 'tools', proficiency: 80, icon: 'git-alt', order: 1 },
            { name: 'VS Code', category: 'tools', proficiency: 90, icon: 'code', order: 2 },
            { name: 'Figma', category: 'tools', proficiency: 70, icon: 'figma', order: 3 },
            { name: 'Photoshop', category: 'tools', proficiency: 75, icon: 'image', order: 4 },
            { name: 'Canva', category: 'tools', proficiency: 90, icon: 'palette', order: 5 },
            { name: 'Tally', category: 'tools', proficiency: 80, icon: 'calculator', order: 6 },
            { name: 'Typing (Hindi/English)', category: 'tools', proficiency: 85, icon: 'keyboard', order: 7 },
        ];

        await Skill.insertMany([...aiSkills, ...officeSkills, ...frontendSkills, ...backendSkills, ...toolSkills]);
        console.log('✅ Skills created (AI, Office, Frontend, Backend, Tools)');

        // Create Education
        await Education.insertMany([
            {
                institution: 'Government Polytechnic Chhapra',
                degree: 'Diploma',
                field: 'Computer Science & Engineering',
                startYear: '2022',
                endYear: '2025',
                description: 'Currently pursuing Diploma in CSE. Learning programming, web development, database management, and software engineering.',
                order: 1
            },
            {
                institution: 'ADCA Course',
                degree: 'Advance Diploma',
                field: 'Computer Application',
                startYear: '2021',
                endYear: '2022',
                description: 'Completed ADCA with skills in MS Office, Internet, Tally, DTP, and basic programming.',
                order: 2
            },
            {
                institution: 'KYP (Kaushal Yuva Program)',
                degree: 'Certificate',
                field: 'Computer Skills',
                startYear: '2021',
                endYear: '2021',
                description: 'Government of Bihar skill development program. Learned computer fundamentals, MS Office, and soft skills.',
                order: 3
            },
            {
                institution: 'High School',
                degree: 'Matriculation',
                field: 'General Studies',
                startYear: '2020',
                endYear: '2022',
                description: 'Completed 10th standard with good grades.',
                order: 4
            }
        ]);
        console.log('✅ Education created (Polytechnic, ADCA, KYP)');

        // Create Projects
        await Project.insertMany([
            {
                title: 'Portfolio Website',
                description: 'A modern, responsive portfolio website with admin panel built using MERN stack. Features include dark/light theme, contact form, and dynamic content management.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB', 'Express.js'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/portfolio',
                liveUrl: '#',
                featured: true,
                order: 1
            },
            {
                title: 'School Management System',
                description: 'A complete school management portal with separate dashboards for Admin, Teachers, and Students. Includes attendance, results, assignments, and fee management.',
                technologies: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'JWT Auth'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/school-management',
                liveUrl: '#',
                featured: true,
                order: 2
            },
            {
                title: 'E-Commerce Website',
                description: 'An online shopping platform with product catalog, cart functionality, user authentication, and payment integration. Admin panel for product management.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/ecommerce',
                liveUrl: '#',
                featured: true,
                order: 3
            },
            {
                title: 'Weather App',
                description: 'A weather application that shows current weather, forecast, and temperature for any city using OpenWeatherMap API. Beautiful UI with weather animations.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/weather-app',
                liveUrl: '#',
                featured: false,
                order: 4
            },
            {
                title: 'Todo List App',
                description: 'A simple yet powerful task management app with features like add, edit, delete, mark complete, and filter tasks. Data persists in local storage.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/todo-app',
                liveUrl: '#',
                featured: false,
                order: 5
            },
            {
                title: 'Calculator App',
                description: 'A scientific calculator with basic and advanced operations. Features include history, memory functions, and keyboard support.',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/calculator',
                liveUrl: '#',
                featured: false,
                order: 6
            },
            {
                title: 'Quiz App',
                description: 'An interactive quiz application with multiple categories, timer, score tracking, and leaderboard. Questions fetched from API or custom database.',
                technologies: ['React.js', 'CSS', 'Quiz API'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/quiz-app',
                liveUrl: '#',
                featured: false,
                order: 7
            },
            {
                title: 'Blog Website',
                description: 'A blogging platform where users can read articles, and admin can create, edit, and delete posts. Features categories, search, and comments.',
                technologies: ['Node.js', 'Express.js', 'MongoDB', 'EJS'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/blog',
                liveUrl: '#',
                featured: false,
                order: 8
            },
            {
                title: 'Chat Application',
                description: 'A real-time chat application with private messaging, group chats, and online status indicators using Socket.io.',
                technologies: ['Node.js', 'Socket.io', 'MongoDB', 'React.js'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/chat-app',
                liveUrl: '#',
                featured: true,
                order: 9
            },
            {
                title: 'Expense Tracker',
                description: 'A personal finance app to track income and expenses, view reports, and set budgets. Export data to Excel feature included.',
                technologies: ['React.js', 'Node.js', 'MongoDB', 'Chart.js'],
                category: 'web',
                githubUrl: 'https://github.com/mdazad/expense-tracker',
                liveUrl: '#',
                featured: false,
                order: 10
            }
        ]);
        console.log('✅ Projects created (10 projects)');

        // Create Services
        await Service.insertMany([
            {
                title: 'Web Development',
                description: 'Custom website development using modern technologies. Responsive design, SEO-friendly, and fast loading websites.',
                icon: 'code',
                order: 1
            },
            {
                title: 'UI/UX Design',
                description: 'Beautiful and user-friendly interface designs using Figma and Canva. Modern, clean, and professional designs.',
                icon: 'layout',
                order: 2
            },
            {
                title: 'MS Office Work',
                description: 'Professional document creation, spreadsheets, presentations, and data entry. Expert in Word, Excel, PowerPoint.',
                icon: 'file',
                order: 3
            },
            {
                title: 'Data Entry',
                description: 'Fast and accurate data entry services. Typing in both Hindi and English with high speed and accuracy.',
                icon: 'keyboard',
                order: 4
            },
            {
                title: 'AI Assistance',
                description: 'Leveraging AI tools like ChatGPT, Gemini, and Canva AI for content creation, image generation, and automation.',
                icon: 'robot',
                order: 5
            },
            {
                title: 'Technical Support',
                description: 'Computer troubleshooting, software installation, and technical guidance for various applications.',
                icon: 'tool',
                order: 6
            }
        ]);
        console.log('✅ Services created');

        // Create Certificates
        await Certificate.insertMany([
            {
                title: 'ADCA Certificate',
                issuer: 'Computer Institute',
                date: new Date('2022-06-01'),
                description: 'Advance Diploma in Computer Application - MS Office, Tally, Internet, DTP',
                order: 1
            },
            {
                title: 'KYP Certificate',
                issuer: 'Government of Bihar',
                date: new Date('2021-12-01'),
                description: 'Kaushal Yuva Program - Computer Skills & Soft Skills Training',
                order: 2
            },
            {
                title: 'Web Development',
                issuer: 'Online Course',
                date: new Date('2023-06-01'),
                description: 'Full Stack Web Development with HTML, CSS, JavaScript, and Node.js',
                order: 3
            },
            {
                title: 'React.js Fundamentals',
                issuer: 'Online Course',
                date: new Date('2023-09-01'),
                description: 'React.js fundamentals including hooks, state management, and routing',
                order: 4
            },
            {
                title: 'AI Tools Proficiency',
                issuer: 'Self Learning',
                date: new Date('2024-01-01'),
                description: 'Proficiency in ChatGPT, Google Gemini, Midjourney, and other AI tools',
                order: 5
            }
        ]);
        console.log('✅ Certificates created');

        console.log('\n🎉 Database seeded successfully!');
        console.log('📋 Admin Login: azad79900@gmail.com / Azad@4153');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
