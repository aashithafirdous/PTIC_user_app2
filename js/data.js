// ============================================================
// PTIC – data.js
// All mock data for the stakeholder application prototype
// ============================================================

const PTIC_DATA = {

  // ── Current User ──────────────────────────────────────────
  currentUser: {
    id: 'u0',
    name: 'Karthik Rajan',
    type: 'Farmer',
    location: 'Namakkal, Tamil Nadu',
    email: 'karthik.rajan@example.com',
    phone: '+91 98456 12345',
    about: 'Poultry farmer with 15 years of experience in broiler and layer farming. Managing 40,000 birds across 3 farms. Passionate about adopting new technology to improve farm efficiency.',
    company: 'Rajan Poultry Farms',
    role: 'Owner',
    companyDesc: 'A family-run poultry operation specialising in broiler production in the Namakkal district.',
    interests: ['Broiler Farming', 'Disease Management', 'Farm Automation', 'Biosecurity', 'Feed Efficiency'],
    connections: ['u1','u3','u5','u7'],
    pendingOut: ['u2','u6'],
    pendingIn: ['u4','u9'],
    questions: ['q1','q3'],
    answers: ['a2','a5'],
    enquiries: ['en1','en2'],
    events: ['ev1'],
    avatar: null,
  },

  // ── People ────────────────────────────────────────────────
  people: [
    {
      id: 'u1',
      name: 'Dr. Arun Kumar',
      type: 'Veterinarian / Expert',
      location: 'Namakkal, Tamil Nadu',
      email: 'arun.kumar@vetcare.in',
      phone: '+91 94231 77890',
      about: 'Poultry veterinarian with 20+ years of clinical experience. Specialises in respiratory disease management, vaccination protocols, and biosecurity.',
      company: 'VetCare Poultry Services',
      role: 'Senior Veterinarian',
      companyDesc: 'Specialised veterinary services for poultry farms across Tamil Nadu.',
      interests: ['Poultry Health', 'Biosecurity', 'Disease Management', 'Vaccination'],
      avatar: null,
    },
    {
      id: 'u2',
      name: 'Priya Subramaniam',
      type: 'Technology Provider',
      location: 'Coimbatore, Tamil Nadu',
      email: 'priya@agritech.io',
      phone: '+91 97345 22100',
      about: 'Building smart poultry monitoring solutions using IoT and AI. Helping farmers improve mortality detection and feed conversion ratios.',
      company: 'AgriTech Solutions',
      role: 'Founder & CEO',
      companyDesc: 'IoT-based smart farming solutions for the poultry industry.',
      interests: ['Farm Automation', 'IoT', 'AI in Agriculture', 'Smart Sensors'],
      avatar: null,
    },
    {
      id: 'u3',
      name: 'Rajesh Murugan',
      type: 'Integrator',
      location: 'Salem, Tamil Nadu',
      email: 'rajesh@srinivasa.com',
      phone: '+91 99440 55678',
      about: 'Managing contract farming operations for 500+ farmer partners in Salem and Namakkal regions.',
      company: 'Srinivasa Poultry Integrations',
      role: 'Operations Manager',
      companyDesc: 'One of the largest poultry integrators in Tamil Nadu managing the entire supply chain.',
      interests: ['Broiler Integration', 'Supply Chain', 'Feed Management', 'Contract Farming'],
      avatar: null,
    },
    {
      id: 'u4',
      name: 'Dr. Meena Krishnamurthy',
      type: 'Researcher / Academia',
      location: 'Chennai, Tamil Nadu',
      email: 'meena.k@tanuvas.ac.in',
      phone: '+91 44 2555 8899',
      about: 'Poultry nutrition researcher at TANUVAS. Focusing on alternative feed ingredients and antibiotic-free production systems.',
      company: 'TANUVAS',
      role: 'Associate Professor',
      companyDesc: 'Tamil Nadu Veterinary and Animal Sciences University — premier institution for animal sciences.',
      interests: ['Poultry Nutrition', 'Feed Research', 'Antibiotic-Free Production', 'Gut Health'],
      avatar: null,
    },
    {
      id: 'u5',
      name: 'Suresh Balaji',
      type: 'Farmer',
      location: 'Erode, Tamil Nadu',
      email: 'suresh.balaji@gmail.com',
      phone: '+91 96770 43210',
      about: 'Layer farmer with a flock of 25,000 birds. Interested in improving egg production efficiency and adopting cage-free systems.',
      company: 'Balaji Layer Farms',
      role: 'Proprietor',
      companyDesc: 'Layer farm producing quality eggs for retail and institutional buyers.',
      interests: ['Layer Farming', 'Egg Production', 'Cage-Free Systems', 'Biosecurity'],
      avatar: null,
    },
    {
      id: 'u6',
      name: 'Anitha Selvam',
      type: 'Startup / Innovator',
      location: 'Bangalore, Karnataka',
      email: 'anitha@poultriai.com',
      phone: '+91 80 4123 9876',
      about: 'Building AI-powered disease detection for poultry using computer vision and behavioural analytics.',
      company: 'PoultriAI',
      role: 'Co-founder',
      companyDesc: 'AI startup pioneering early disease detection in commercial poultry farms.',
      interests: ['AI', 'Computer Vision', 'Disease Detection', 'Precision Farming'],
      avatar: null,
    },
    {
      id: 'u7',
      name: 'Vijayakumar Pandian',
      type: 'Solution Provider',
      location: 'Madurai, Tamil Nadu',
      email: 'vk@greenhousenets.com',
      phone: '+91 98430 11223',
      about: 'Providing housing solutions, ventilation systems and environmental control equipment for poultry farms.',
      company: 'Greenhouse Nets & Structures',
      role: 'Director',
      companyDesc: 'Leading manufacturer of poultry housing solutions in South India.',
      interests: ['Poultry Housing', 'Ventilation', 'Environmental Control', 'Farm Construction'],
      avatar: null,
    },
    {
      id: 'u8',
      name: 'Lakshmi Narayanan',
      type: 'Veterinarian / Expert',
      location: 'Tirunelveli, Tamil Nadu',
      email: 'lakshmi@poultryvet.com',
      phone: '+91 91760 88900',
      about: 'Field veterinarian specialising in broiler health management and flock performance optimisation.',
      company: 'PoultryVet Clinic',
      role: 'Senior Vet',
      companyDesc: 'Mobile veterinary clinic serving poultry farms across southern Tamil Nadu.',
      interests: ['Broiler Health', 'Flock Management', 'Vaccination Schedules', 'Mortality Reduction'],
      avatar: null,
    },
    {
      id: 'u9',
      name: 'Murugesan Arumugam',
      type: 'Farmer',
      location: 'Dharmapuri, Tamil Nadu',
      email: 'muru.farmer@gmail.com',
      phone: '+91 94000 33456',
      about: 'New-generation farmer exploring technology-driven approaches to improve farm profitability.',
      company: 'Arumugam Agro Farms',
      role: 'Owner',
      companyDesc: 'Mixed poultry and agriculture operation.',
      interests: ['Smart Farming', 'Feed Efficiency', 'Broiler Production', 'Farm Technology'],
      avatar: null,
    },
    {
      id: 'u10',
      name: 'Sujatha Venkatesh',
      type: 'Solution Provider',
      location: 'Hyderabad, Telangana',
      email: 'sujatha@feedmaster.com',
      phone: '+91 40 4567 8900',
      about: 'Formulating high-performance poultry feed and nutritional supplements for optimal bird performance.',
      company: 'FeedMaster Nutrition',
      role: 'Chief Nutritionist',
      companyDesc: 'Premium poultry feed and supplement manufacturer.',
      interests: ['Feed Formulation', 'Poultry Nutrition', 'Growth Performance', 'FCR Improvement'],
      avatar: null,
    },
  ],

  // ── Companies ─────────────────────────────────────────────
  companies: [
    {
      id: 'c1',
      name: 'AgriTech Solutions',
      type: 'Technology Provider',
      location: 'Coimbatore, Tamil Nadu',
      description: 'IoT-based smart farming solutions for poultry. Specialising in environment monitoring, automated feeders and data analytics.',
      interests: ['IoT', 'Smart Farming', 'Data Analytics'],
      contact: 'priya@agritech.io',
      employees: '50–100',
    },
    {
      id: 'c2',
      name: 'Srinivasa Poultry Integrations',
      type: 'Integrator',
      location: 'Salem, Tamil Nadu',
      description: 'Contract farming and integration services across the poultry supply chain — from hatchery to market.',
      interests: ['Broiler Integration', 'Supply Chain'],
      contact: 'info@srinivasa.com',
      employees: '500+',
    },
    {
      id: 'c3',
      name: 'Greenhouse Nets & Structures',
      type: 'Solution Provider',
      location: 'Madurai, Tamil Nadu',
      description: 'Housing solutions, ventilation systems and environmental control equipment for poultry farms.',
      interests: ['Poultry Housing', 'Ventilation'],
      contact: 'vk@greenhousenets.com',
      employees: '100–250',
    },
    {
      id: 'c4',
      name: 'FeedMaster Nutrition',
      type: 'Solution Provider',
      location: 'Hyderabad, Telangana',
      description: 'Premium poultry feed and nutritional supplements for optimal bird performance and FCR.',
      interests: ['Feed', 'Nutrition', 'Supplements'],
      contact: 'info@feedmaster.com',
      employees: '200–500',
    },
    {
      id: 'c5',
      name: 'PoultriAI',
      type: 'Startup / Innovator',
      location: 'Bangalore, Karnataka',
      description: 'AI-powered early disease detection for poultry farms using computer vision cameras.',
      interests: ['AI', 'Disease Detection'],
      contact: 'hello@poultriai.com',
      employees: '10–50',
    },
  ],

  // ── Products / Services ───────────────────────────────────
  products: [
    {
      id: 'p1',
      name: 'SmartFarm Poultry Monitor Pro',
      provider: 'AgriTech Solutions',
      providerId: 'c1',
      category: 'Technology',
      description: 'All-in-one IoT monitoring system for poultry farms. Tracks temperature, humidity, ammonia, CO2, and bird activity in real-time. Includes mobile alerts and automated fan control.',
      features: [
        '24/7 environmental monitoring',
        'Automated ventilation control',
        'Mobile alerts & dashboard',
        'Historical data analytics',
        'Mortality detection alerts',
        'Cloud-based reporting',
      ],
      suitableFor: 'Broiler and layer farms (1,000+ birds)',
      image: null,
      tag: 'Technology',
    },
    {
      id: 'p2',
      name: 'PoultriAI Disease Detector',
      provider: 'PoultriAI',
      providerId: 'c5',
      category: 'Technology',
      description: 'Computer vision system using AI cameras to detect early signs of disease, respiratory distress and abnormal behaviour patterns in broiler flocks.',
      features: [
        'Real-time camera surveillance',
        'AI-powered anomaly detection',
        'Early disease alerts (24–48 hrs before visible symptoms)',
        'Flock behaviour analytics',
        'API integration with farm systems',
      ],
      suitableFor: 'Commercial broiler farms (10,000+ birds)',
      image: null,
      tag: 'Technology',
    },
    {
      id: 'p3',
      name: 'MaxFeed Broiler Starter',
      provider: 'FeedMaster Nutrition',
      providerId: 'c4',
      category: 'Feed',
      description: 'High-energy broiler starter feed formulated for maximum weight gain in days 1–14. Scientifically balanced protein and energy ratios for optimal FCR.',
      features: [
        'High crude protein (23%)',
        'Optimised amino acid profile',
        'Coccidiostat included',
        'Available in pellet and crumble form',
        'Free nutritionist support',
      ],
      suitableFor: 'Day-old to 14-day broiler chicks',
      image: null,
      tag: 'Feed',
    },
    {
      id: 'p4',
      name: 'MaxFeed Layer Premium',
      provider: 'FeedMaster Nutrition',
      providerId: 'c4',
      category: 'Feed',
      description: 'Complete layer feed designed to maximise egg production, shell quality and hen-day production rates.',
      features: [
        'Balanced calcium:phosphorus ratio',
        'Omega-3 enriched formula',
        'Supports peak production periods',
        'Free delivery above 5MT',
      ],
      suitableFor: 'Layer hens (18 weeks onwards)',
      image: null,
      tag: 'Feed',
    },
    {
      id: 'p5',
      name: 'EcoVent Tunnel Ventilation System',
      provider: 'Greenhouse Nets & Structures',
      providerId: 'c3',
      category: 'Equipment',
      description: 'High-performance tunnel ventilation system designed for Indian climate conditions. Reduces heat stress and improves bird comfort and performance.',
      features: [
        'Energy-efficient EC fans',
        'Automated thermostat control',
        'Suitable for hot and humid climates',
        'Easy installation and maintenance',
        '5-year warranty',
      ],
      suitableFor: 'Broiler and layer houses (any size)',
      image: null,
      tag: 'Equipment',
    },
    {
      id: 'p6',
      name: 'BioShield Disinfectant Concentrate',
      provider: 'VetCare Poultry Services',
      providerId: 'c1',
      category: 'Health',
      description: 'Broad-spectrum disinfectant for poultry houses. Effective against bacteria, viruses and fungi. Safe for use in occupied houses at correct dilution.',
      features: [
        'Broad-spectrum efficacy',
        'Low-odour formulation',
        'QAC + Glutaraldehyde base',
        'Approved for use in India',
        'Economical concentrate — 1:200 dilution',
      ],
      suitableFor: 'All poultry operations — biosecurity programs',
      image: null,
      tag: 'Health',
    },
    {
      id: 'p7',
      name: 'Farm Management Consultancy',
      provider: 'VetCare Poultry Services',
      providerId: 'c1',
      category: 'Services',
      description: 'On-farm consultancy to assess current performance, identify gaps and create a customised farm improvement plan.',
      features: [
        'Initial farm audit',
        'Flock health assessment',
        'Biosecurity review',
        'Feed and nutrition audit',
        'Written action plan',
        'Follow-up monitoring visit',
      ],
      suitableFor: 'All farm sizes',
      image: null,
      tag: 'Services',
    },
    {
      id: 'p8',
      name: 'ProGut Probiotic Supplement',
      provider: 'FeedMaster Nutrition',
      providerId: 'c4',
      category: 'Health',
      description: 'Synbiotic supplement containing probiotics and prebiotics to improve gut health, reduce FCR and support antibiotic-free production.',
      features: [
        'Multi-strain probiotic formula',
        'Yeast-based prebiotic',
        'Improves gut microbiome diversity',
        'Reduces necrotic enteritis risk',
        'Mix with feed or water',
      ],
      suitableFor: 'Broiler and layer flocks of all ages',
      image: null,
      tag: 'Health',
    },
    {
      id: 'p9',
      name: 'Nipple Drinking System',
      provider: 'Greenhouse Nets & Structures',
      providerId: 'c3',
      category: 'Equipment',
      description: '360° trigger nipple drinker system with pressure regulators and drip cups. Reduces water wastage by 40% vs. open drinkers.',
      features: [
        'Stainless steel nipples',
        '360° activation angle',
        'Pressure-regulated flow',
        'Easy height adjustment',
        'Reduces litter moisture',
      ],
      suitableFor: 'Broiler and layer houses',
      image: null,
      tag: 'Equipment',
    },
  ],

  // ── Questions & Answers ───────────────────────────────────
  questions: [
    {
      id: 'q1',
      title: 'Why is mortality increasing during summer months?',
      body: 'Our mortality has gone up from 1.2% to 3.8% in the past two summer cycles. We\'re running fans but still facing heat stress. Flock size is 30,000 birds. Any advice on what we should check first?',
      author: 'u0',
      topic: 'Health & Disease',
      date: '2026-09-15',
      answers: ['a1','a2'],
      likes: 14,
      tags: ['Heat Stress', 'Mortality', 'Summer'],
    },
    {
      id: 'q2',
      title: 'Best practices for vaccination against Newcastle Disease in hot climate?',
      body: 'We face challenges storing vaccines in proper temperatures due to frequent power cuts. What are the best practices to maintain vaccine cold chain in rural Tamil Nadu conditions?',
      author: 'u5',
      topic: 'Health & Disease',
      date: '2026-09-12',
      answers: ['a3','a4'],
      likes: 22,
      tags: ['Newcastle', 'Vaccination', 'Cold Chain'],
    },
    {
      id: 'q3',
      title: 'How can I improve FCR from 1.85 to below 1.75 for 42-day broilers?',
      body: 'Our current FCR is 1.85 but our integrator target is 1.75. We\'re using standard commercial feed. What are the main factors I should focus on — nutrition, environment or management?',
      author: 'u0',
      topic: 'Feed & Nutrition',
      date: '2026-09-10',
      answers: ['a5'],
      likes: 19,
      tags: ['FCR', 'Broiler', 'Feed Efficiency'],
    },
    {
      id: 'q4',
      title: 'What IoT sensors are most useful for a 20,000-bird broiler farm?',
      body: 'I\'m planning to invest in smart monitoring for my farm. What sensors would give me the best return — temperature, humidity, ammonia, or bird weight? What brands are available in India?',
      author: 'u9',
      topic: 'Technology',
      date: '2026-09-08',
      answers: ['a6','a7'],
      likes: 31,
      tags: ['IoT', 'Smart Farming', 'Sensors'],
    },
    {
      id: 'q5',
      title: 'Is cage-free egg production economically viable for small farmers in Tamil Nadu?',
      body: 'There is growing demand from exporters for cage-free eggs. But I\'m concerned about the investment and the higher management required. Has anyone made this transition?',
      author: 'u5',
      topic: 'Production Systems',
      date: '2026-09-05',
      answers: [],
      likes: 8,
      tags: ['Cage-Free', 'Layer', 'Egg Export'],
    },
    {
      id: 'q6',
      title: 'What is the recommended litter management protocol for broilers?',
      body: 'We\'re seeing high litter moisture and footpad dermatitis. Our mortality is within range but we\'re losing weight in the last week. Need advice on litter management.',
      author: 'u9',
      topic: 'Management',
      date: '2026-09-01',
      answers: ['a8'],
      likes: 12,
      tags: ['Litter', 'Footpad', 'Management'],
    },
  ],

  answers: {
    a1: {
      id: 'a1',
      questionId: 'q1',
      author: 'u1',
      text: 'Heat stress during summer is a major concern. First, check your ventilation — tunnel ventilation should maintain air speed of 2.5 m/s minimum at bird level. Consider adding evaporative cooling pads if not already in place. Also, avoid feeding during the hottest part of the day (12–3pm). Schedule feeding early morning and evening. Ensure water is cool — pre-cool the water line. Electrolyte supplementation in water can reduce mortality by 30–40%.',
      date: '2026-09-15',
      likes: 18,
      dislikes: 1,
    },
    a2: {
      id: 'a2',
      questionId: 'q1',
      author: 'u0',
      text: 'Thank you Dr. Arun. We implemented the electrolyte supplement and shifted feeding times. Already seeing some improvement in day 3.',
      date: '2026-09-16',
      likes: 4,
      dislikes: 0,
    },
    a3: {
      id: 'a3',
      questionId: 'q2',
      author: 'u1',
      text: 'For cold chain in rural areas, invest in a portable vaccine carrier with ice packs. Always use a thermometer inside the carrier. Keep vaccines between 2–8°C. Never refreeze thawed vaccines. For areas with unreliable power, consider a small solar-powered fridge dedicated for vaccines only. The investment is worth it — failed vaccination due to improper cold chain is extremely costly.',
      date: '2026-09-13',
      likes: 25,
      dislikes: 0,
    },
    a4: {
      id: 'a4',
      questionId: 'q2',
      author: 'u4',
      text: 'Our research at TANUVAS has shown that thermostable Newcastle vaccine strains can tolerate slightly warmer conditions. I can share some literature on thermostable ND vaccines that may be more suitable for your region.',
      date: '2026-09-13',
      likes: 17,
      dislikes: 0,
    },
    a5: {
      id: 'a5',
      questionId: 'q3',
      author: 'u10',
      text: 'FCR improvement requires a systematic approach. Top factors: (1) Feed quality — ensure no mycotoxin contamination; test feed if FCR is consistently above target. (2) Water management — birds consume 1.8x more water than feed; poor water quality reduces feed intake. (3) Gut health — use probiotics from day 1. (4) Health status — subclinical coccidiosis alone can add 0.1–0.15 to FCR. (5) Stocking density — overcrowding increases FCR. Recommend starting with a full flock audit.',
      date: '2026-09-11',
      likes: 28,
      dislikes: 0,
    },
    a6: {
      id: 'a6',
      questionId: 'q4',
      author: 'u2',
      text: 'For a 20,000-bird farm, I recommend starting with: Temperature & humidity sensors (essential), Ammonia sensor (very important for respiratory health), CO2 monitor. These three together give you the complete picture of air quality. Weight sensors are nice-to-have but expensive. We at AgriTech offer a starter kit that covers all three for a 3-house farm at a reasonable price point.',
      date: '2026-09-09',
      likes: 22,
      dislikes: 1,
    },
    a7: {
      id: 'a7',
      questionId: 'q4',
      author: 'u6',
      text: 'AI-based camera systems can give you information about bird behaviour and health status that sensors can\'t. Our PoultriAI system detects disease 24–48 hours before physical symptoms appear. Combined with environmental sensors, you get a very powerful monitoring system.',
      date: '2026-09-09',
      likes: 15,
      dislikes: 0,
    },
    a8: {
      id: 'a8',
      questionId: 'q6',
      author: 'u1',
      text: 'For litter management: (1) Maintain target moisture at 20–25%. (2) If drinker leakage is occurring, fix it immediately. (3) Crust removal every 5–7 days around drinkers. (4) Partial litter replacement in wet areas. (5) Reduce stocking density in affected areas if severe. (6) Add a litter conditioner (sulphate of iron) to reduce ammonia. Footpad dermatitis typically improves within 7–10 days of corrective action.',
      date: '2026-09-02',
      likes: 16,
      dislikes: 0,
    },
  },

  // ── Events ────────────────────────────────────────────────
  events: [
    {
      id: 'ev1',
      name: 'PTSE 2026 – Poultry Tech South East',
      shortName: 'PTSE 2026',
      date: '18–20 October 2026',
      dateStart: '2026-10-18',
      dateEnd: '2026-10-20',
      location: 'Chennai Trade Centre, Chennai',
      description: 'India\'s premier poultry technology and trade show for South and East India. Bringing together farmers, integrators, technology providers, veterinarians and industry leaders for three days of learning, networking and business.',
      overview: 'PTSE 2026 is a landmark event for India\'s poultry industry. Featuring over 200 exhibitors, 40+ sessions, international speakers and live demonstrations of the latest poultry technologies. Whether you\'re a farmer looking for solutions or a technology provider looking to connect with buyers — PTSE is the place to be.',
      registered: true,
      agenda: [
        { time: '09:00 – 10:00', session: 'Plenary Session', topic: 'The Future of Poultry Farming in India', speaker: 'Dr. Rajesh Mishra, CIFS' },
        { time: '10:30 – 11:30', session: 'Technical Session 1', topic: 'Smart Farm Technologies: ROI Analysis', speaker: 'Priya Subramaniam, AgriTech Solutions' },
        { time: '11:30 – 12:30', session: 'Technical Session 2', topic: 'Biosecurity Protocols Post-AI Outbreak', speaker: 'Dr. Arun Kumar, VetCare' },
        { time: '14:00 – 15:00', session: 'Panel Discussion', topic: 'Contract Farming: Farmer Perspective', speaker: 'Multiple Panellists' },
        { time: '15:00 – 16:00', session: 'Technical Session 3', topic: 'Antibiotic-Free Production: Feasibility in India', speaker: 'Dr. Meena Krishnamurthy, TANUVAS' },
        { time: '16:30 – 17:30', session: 'Startup Showcase', topic: 'Innovation in Poultry Tech: 5 Startups', speaker: 'Anitha Selvam, PoultriAI & others' },
      ],
      speakers: [
        { name: 'Dr. Rajesh Mishra', role: 'Director', org: 'Central Institute of Fisheries & Animal Sciences', avatar: null },
        { name: 'Priya Subramaniam', role: 'Founder & CEO', org: 'AgriTech Solutions', avatar: null },
        { name: 'Dr. Arun Kumar', role: 'Senior Veterinarian', org: 'VetCare Poultry Services', avatar: null },
        { name: 'Dr. Meena Krishnamurthy', role: 'Associate Professor', org: 'TANUVAS', avatar: null },
        { name: 'Anitha Selvam', role: 'Co-founder', org: 'PoultriAI', avatar: null },
        { name: 'Vijayakumar Pandian', role: 'Director', org: 'Greenhouse Nets & Structures', avatar: null },
      ],
      sponsors: [
        { name: 'FeedMaster Nutrition', tier: 'Title Sponsor', logo: 'FM' },
        { name: 'AgriTech Solutions', tier: 'Gold Sponsor', logo: 'AT' },
        { name: 'Srinivasa Integrations', tier: 'Silver Sponsor', logo: 'SI' },
        { name: 'Greenhouse Nets', tier: 'Silver Sponsor', logo: 'GN' },
        { name: 'VetCare', tier: 'Associate Sponsor', logo: 'VC' },
        { name: 'PoultriAI', tier: 'Innovation Partner', logo: 'PA' },
      ],
      stalls: [
        { number: 'A-101', company: 'AgriTech Solutions', category: 'Technology', description: 'Live demo of SmartFarm Monitor Pro' },
        { number: 'A-102', company: 'PoultriAI', category: 'Technology', description: 'AI disease detection live demonstration' },
        { number: 'B-201', company: 'FeedMaster Nutrition', category: 'Feed', description: 'Premium feed and supplement showcase' },
        { number: 'B-202', company: 'Greenhouse Nets', category: 'Equipment', description: 'Housing & ventilation solutions' },
        { number: 'C-301', company: 'VetCare', category: 'Health', description: 'Biosecurity & health products' },
        { number: 'C-302', company: 'Srinivasa Integrations', category: 'Integrator', description: 'Contract farming opportunities' },
      ],
      videos: [],
    },
    {
      id: 'ev2',
      name: 'Poultry Farmer Knowledge Meetup – Namakkal',
      shortName: 'Namakkal Meetup',
      date: '5 October 2026',
      dateStart: '2026-10-05',
      location: 'Namakkal District Cooperative Hall',
      description: 'A local knowledge-sharing meetup for poultry farmers in the Namakkal region. Topics include summer management and biosecurity.',
      overview: 'A free knowledge-sharing meetup organised by PTIC for farmers in Namakkal and surrounding areas.',
      registered: false,
      agenda: [
        { time: '10:00 – 11:00', session: 'Session 1', topic: 'Summer Heat Stress Management', speaker: 'Dr. Arun Kumar' },
        { time: '11:30 – 12:30', session: 'Session 2', topic: 'Biosecurity Fundamentals', speaker: 'Dr. Lakshmi Narayanan' },
      ],
      speakers: [
        { name: 'Dr. Arun Kumar', role: 'Senior Veterinarian', org: 'VetCare', avatar: null },
        { name: 'Dr. Lakshmi Narayanan', role: 'Senior Vet', org: 'PoultryVet Clinic', avatar: null },
      ],
      sponsors: [],
      stalls: [],
      videos: [],
    },
    {
      id: 'ev3',
      name: 'Feed Technology Symposium 2026',
      shortName: 'FTS 2026',
      date: '12 November 2026',
      dateStart: '2026-11-12',
      location: 'Hyderabad International Convention Centre',
      description: 'National symposium on poultry feed technology, formulation advances and gut health management.',
      overview: 'Bringing together nutritionists, feed manufacturers and researchers to discuss innovations in poultry feed technology.',
      registered: false,
      agenda: [],
      speakers: [],
      sponsors: [],
      stalls: [],
      videos: [],
    },
    {
      id: 'ev4',
      name: 'AgriStartup Pitch Day – Poultry Edition',
      shortName: 'Startup Pitch Day',
      date: '25 October 2026',
      dateStart: '2026-10-25',
      location: 'IIT Madras Research Park, Chennai',
      description: 'Startups pitching poultry technology innovations to investors and industry leaders.',
      overview: 'A platform for agri-tech startups in the poultry space to present their innovations.',
      registered: false,
      agenda: [],
      speakers: [],
      sponsors: [],
      stalls: [],
      videos: [],
    },
  ],

  // ── Notifications ─────────────────────────────────────────
  notifications: [
    { id: 'n1', type: 'connection_accepted', title: 'Connection accepted', desc: 'Dr. Arun Kumar accepted your connection request.', time: '2 hours ago', read: false, userId: 'u1' },
    { id: 'n2', type: 'new_answer', title: 'New answer on your question', desc: 'Dr. Arun Kumar answered your question about summer mortality.', time: '3 hours ago', read: false, userId: 'u1' },
    { id: 'n3', type: 'event_reminder', title: 'Event reminder', desc: 'PTSE 2026 is in 25 days. Complete your registration.', time: '5 hours ago', read: false },
    { id: 'n4', type: 'enquiry_response', title: 'Enquiry response received', desc: 'AgriTech Solutions responded to your enquiry about SmartFarm Monitor Pro.', time: 'Yesterday', read: true },
    { id: 'n5', type: 'connection_request', title: 'New connection request', desc: 'Dr. Meena Krishnamurthy wants to connect with you.', time: 'Yesterday', read: true, userId: 'u4' },
    { id: 'n6', type: 'new_answer', title: 'Your question got a new answer', desc: 'Sujatha Venkatesh answered your FCR question.', time: '2 days ago', read: true },
    { id: 'n7', type: 'event_reminder', title: 'Namakkal Meetup — Next week', desc: 'The Poultry Farmer Knowledge Meetup is on 5 October.', time: '3 days ago', read: true },
    { id: 'n8', type: 'connection_request', title: 'New connection request', desc: 'Murugesan Arumugam wants to connect with you.', time: '4 days ago', read: true, userId: 'u9' },
    { id: 'n9', type: 'like', title: 'Your answer was liked', desc: 'Your answer received 5 new likes.', time: '5 days ago', read: true },
    { id: 'n10', type: 'enquiry_response', title: 'Enquiry closed', desc: 'Your enquiry for EcoVent has been marked as responded.', time: '1 week ago', read: true },
  ],

  // ── Enquiries ─────────────────────────────────────────────
  enquiries: [
    {
      id: 'en1',
      productId: 'p1',
      productName: 'SmartFarm Poultry Monitor Pro',
      provider: 'AgriTech Solutions',
      requirement: 'I want to monitor 3 houses of 10,000 birds each. Need pricing for the full system including installation.',
      message: 'Please share brochure, pricing and whether you provide training for the system.',
      status: 'Responded',
      date: '2026-09-10',
      response: 'Thank you for your interest. We have emailed the detailed proposal for a 3-house system. Our team will call you to schedule a demo.',
    },
    {
      id: 'en2',
      productId: 'p5',
      productName: 'EcoVent Tunnel Ventilation System',
      provider: 'Greenhouse Nets & Structures',
      requirement: 'Looking for ventilation upgrade for 2 broiler houses of 12,000 birds each.',
      message: 'Current fans are old and inefficient. Want to understand the payback period and energy savings.',
      status: 'Pending',
      date: '2026-09-18',
      response: null,
    },
  ],

  // ── Topics for Q&A ────────────────────────────────────────
  topics: [
    'Health & Disease', 'Feed & Nutrition', 'Technology', 'Management',
    'Production Systems', 'Housing & Equipment', 'Biosecurity', 'Business & Finance',
    'Regulation & Policy', 'Other',
  ],

  // ── Stakeholder Types ─────────────────────────────────────
  stakeholderTypes: [
    { id: 'farmer', label: 'Farmer', icon: '🌾', color: '#22A06B', bg: '#E6F7F1' },
    { id: 'integrator', label: 'Integrator', icon: '🏭', color: '#1976D2', bg: '#E3F0FC' },
    { id: 'vet', label: 'Veterinarian / Expert', icon: '🩺', color: '#9C27B0', bg: '#F3E5F5' },
    { id: 'tech', label: 'Solution / Technology Provider', icon: '💡', color: '#FF6F00', bg: '#FFF3E0' },
    { id: 'startup', label: 'Startup / Innovator', icon: '🚀', color: '#E53935', bg: '#FDECEA' },
    { id: 'researcher', label: 'Researcher / Academia', icon: '🔬', color: '#0097A7', bg: '#E0F7FA' },
  ],

  // ── Categories for E-Mart ─────────────────────────────────
  emartCategories: ['All', 'Feed', 'Equipment', 'Technology', 'Health', 'Services', 'Solutions'],
};

// ── Helper utilities ──────────────────────────────────────────
const DataUtils = {
  getPerson: (id) => PTIC_DATA.people.find(p => p.id === id) || null,
  getProduct: (id) => PTIC_DATA.products.find(p => p.id === id) || null,
  getEvent: (id) => PTIC_DATA.events.find(e => e.id === id) || null,
  getQuestion: (id) => PTIC_DATA.questions.find(q => q.id === id) || null,
  getAnswer: (id) => PTIC_DATA.answers[id] || null,

  getConnectionStatus: (userId) => {
    const u = PTIC_DATA.currentUser;
    if (u.connections.includes(userId)) return 'connected';
    if (u.pendingOut.includes(userId)) return 'pending';
    if (u.pendingIn.includes(userId)) return 'incoming';
    return 'none';
  },

  getInitials: (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  },

  avatarHTML: (person, size = 'md') => {
    const initials = DataUtils.getInitials(person.name || person);
    return `<div class="avatar avatar-${size}">${initials}</div>`;
  },

  formatDate: (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  timeAgo: (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  },

  unreadCount: () => PTIC_DATA.notifications.filter(n => !n.read).length,

  searchAll: (query) => {
    if (!query || query.length < 2) return null;
    const q = query.toLowerCase();
    return {
      people: PTIC_DATA.people.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.interests || []).some(i => i.toLowerCase().includes(q))
      ).slice(0, 4),
      companies: PTIC_DATA.companies.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ).slice(0, 3),
      products: PTIC_DATA.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 4),
      questions: PTIC_DATA.questions.filter(qn =>
        qn.title.toLowerCase().includes(q) ||
        qn.body.toLowerCase().includes(q)
      ).slice(0, 3),
      events: PTIC_DATA.events.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      ).slice(0, 2),
    };
  },
};
