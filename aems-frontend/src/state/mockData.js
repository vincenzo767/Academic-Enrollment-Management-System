// Program definitions and prefixes
const programDefs = [
  { name: 'BS in Computer Science', prefixes: ['CS'] },
  { name: 'BS in Information Technology', prefixes: ['IT'] },
  { name: 'BS in Multimedia Arts / Digital Media', prefixes: ['MA', 'DM'] },
  { name: 'BS in Architecture', prefixes: ['ARCH'] },
  { name: 'BS in Civil Engineering', prefixes: ['CE'] },
  { name: 'BS in Mechanical Engineering', prefixes: ['ME'] },
  { name: 'BS in Electrical Engineering', prefixes: ['EE'] },
  { name: 'BS in Industrial Engineering', prefixes: ['IE'] },
  { name: 'BS in Chemical Engineering', prefixes: ['CHE'] },
  { name: 'BS in Computer Engineering', prefixes: ['COE'] },
  { name: 'BS in Aerospace Engineering', prefixes: ['AEE'] },
  { name: 'BS in Business Administration - Major in Marketing', prefixes: ['BA'] },
  { name: 'BS in Business Administration - Major in Finance', prefixes: ['BA'] },
  { name: 'BS in Business Administration - Major in Human Resource Management', prefixes: ['BA'] },
  { name: 'BS in Business Administration - Major in Business Analytics', prefixes: ['BA'] },
  { name: 'BS in Accountancy', prefixes: ['ACC'] },
  { name: 'BS in Entrepreneurship', prefixes: ['ENT'] },
  { name: 'BS in Tourism Management', prefixes: ['TM'] },
  { name: 'BS in Hospitality Management', prefixes: ['HM'] },
  { name: 'BS in Office Administration', prefixes: ['OA'] },
  { name: 'BS in Public Administration', prefixes: ['PA'] },
  { name: 'BS in Nursing', prefixes: ['NUR', 'N'] },
  { name: 'BS in Pharmacy', prefixes: ['PHARMA'] },
  { name: 'Bachelor of Elementary Education', prefixes: ['EEDUC'] },
  { name: 'Bachelor of Secondary Education - Major in English', prefixes: ['SEDUC'] },
  { name: 'Bachelor of Secondary Education - Major in Math', prefixes: ['SEDUC'] },
  { name: 'Bachelor of Secondary Education - Major in Science', prefixes: ['SEDUC'] },
  { name: 'Bachelor of Secondary Education - Major in Social Studies', prefixes: ['SEDUC'] },
  { name: 'Bachelor of Secondary Education - Major in Filipino', prefixes: ['SEDUC'] }
]

// helper data used for generating course details
const instructors = ['Dr. Sarah Johnson','Prof. Liam Cruz','Dr. Alice Monroe','Prof. Ken Ito','Dr. Mei Lin','Engr. Daniel Park','Prof. Michael Chen','Dr. Nora Quinn','Prof. Omar Reyes','Dr. Elena Cruz','Prof. Greg Tan','Ms. Liza Mar','Chef Anna Li','Prof. Lorna Day','Dr. Ava Patel','Ms. Jenna Cruz','Prof. Carlos Dela Cruz','Dr. Irene Gomez']
const schedules = ['MWF 08:00-09:30','MWF 09:30-11:00','TTh 10:00-11:30','TTh 13:00-14:30','Sat 09:00-12:00','MWF 11:00-12:30','TTh 08:00-09:30','MWF 14:00-15:30','TTh 15:00-16:30']

// Course names and descriptions organized by program prefix
const courseCatalog = {
  'CS': [
    { title: 'Introduction to Data Analytics', subtitle: 'Fundamentals of data analysis, visualization, and statistical methods' },
    { title: 'Advanced Algorithms', subtitle: 'Complex algorithm design, analysis, and optimization techniques' },
    { title: 'Web Development Fundamentals', subtitle: 'Frontend and backend web technologies with modern frameworks' },
    { title: 'Database Management Systems', subtitle: 'Relational databases, SQL, and data modeling' },
    { title: 'Software Engineering Principles', subtitle: 'Software development lifecycle, design patterns, and methodologies' },
    { title: 'Cloud Computing Architecture', subtitle: 'Cloud platforms, scalability, and distributed systems' },
    { title: 'Machine Learning Basics', subtitle: 'Supervised learning, classification, regression, and evaluation metrics' },
    { title: 'Cybersecurity Fundamentals', subtitle: 'Network security, cryptography, and threat analysis' },
    { title: 'Mobile Application Development', subtitle: 'iOS and Android development with native and cross-platform tools' },
    { title: 'Artificial Intelligence Principles', subtitle: 'AI concepts, knowledge representation, and intelligent systems' }
  ],
  'IT': [
    { title: 'Systems Administration', subtitle: 'Server management, networking, and IT infrastructure' },
    { title: 'Network Administration', subtitle: 'Network configuration, routing, and protocol management' },
    { title: 'IT Project Management', subtitle: 'Project planning, resource allocation, and stakeholder communication' },
    { title: 'Enterprise Solutions', subtitle: 'Large-scale IT solutions and enterprise system integration' },
    { title: 'IT Service Management', subtitle: 'ITIL framework, service delivery, and incident management' },
    { title: 'Information Security', subtitle: 'Security policies, risk management, and compliance frameworks' },
    { title: 'IT Governance', subtitle: 'IT policies, compliance, and organizational management' },
    { title: 'Cloud Services Management', subtitle: 'Cloud service provisioning and management' },
    { title: 'Business Analysis', subtitle: 'Requirements gathering, process modeling, and solution design' },
    { title: 'IT Consulting', subtitle: 'Technology advisory and strategic IT planning' }
  ],
  'MA': [
    { title: 'Digital Design Fundamentals', subtitle: 'Design principles, composition, and visual communication' },
    { title: '3D Modeling and Animation', subtitle: 'Character design, rigging, animation, and effects' },
    { title: 'Video Production', subtitle: 'Cinematography, editing, color grading, and post-production' },
    { title: 'Web Design & UX', subtitle: 'User experience design, wireframing, and interactive design' },
    { title: 'Motion Graphics', subtitle: 'Animation principles, visual effects, and multimedia production' },
    { title: 'Game Design', subtitle: 'Game mechanics, storytelling, level design, and prototyping' },
    { title: 'Digital Illustration', subtitle: 'Digital painting, character design, and visual narrative' },
    { title: 'Audio Production', subtitle: 'Sound design, music production, and audio engineering' },
    { title: 'Interactive Media', subtitle: 'Interactive storytelling, VR/AR, and immersive experiences' },
    { title: 'Graphic Design Principles', subtitle: 'Typography, layout, branding, and visual identity' }
  ],
  'DM': [
    { title: 'Digital Content Strategy', subtitle: 'Content creation, curation, and distribution strategies' },
    { title: 'Social Media Marketing', subtitle: 'Platform management, engagement, and analytics' },
    { title: 'Digital Marketing Fundamentals', subtitle: 'SEO, SEM, email marketing, and digital campaigns' },
    { title: 'Web Analytics', subtitle: 'Data analysis, conversion tracking, and user behavior' },
    { title: 'E-commerce Development', subtitle: 'Online store setup, payment integration, and user experience' },
    { title: 'Digital Branding', subtitle: 'Brand identity, positioning, and online presence' },
    { title: 'Content Management Systems', subtitle: 'CMS platforms, content publishing, and workflow management' },
    { title: 'Mobile-First Design', subtitle: 'Responsive design, mobile optimization, and app development' },
    { title: 'Digital Advertising', subtitle: 'Ad platforms, targeting, conversion optimization' },
    { title: 'User Experience Research', subtitle: 'User testing, personas, and usability studies' }
  ],
  'ARCH': [
    { title: 'Architectural Design I', subtitle: 'Principles of design, composition, and spatial planning' },
    { title: 'Building Information Modeling', subtitle: 'BIM software, 3D modeling, and construction documentation' },
    { title: 'Sustainable Architecture', subtitle: 'Green design, energy efficiency, and environmental impact' },
    { title: 'Urban Planning & Design', subtitle: 'City planning, zoning, and community development' },
    { title: 'Architectural History', subtitle: 'Historical styles, movements, and architectural theory' },
    { title: 'Structural Systems', subtitle: 'Load bearing, materials, and engineering principles' },
    { title: 'Interior Design', subtitle: 'Space planning, aesthetics, and functional design' },
    { title: 'Construction Management', subtitle: 'Project planning, cost estimation, and construction sequencing' },
    { title: 'Landscape Architecture', subtitle: 'Site design, outdoor spaces, and environmental integration' },
    { title: 'Advanced Architectural Design', subtitle: 'Complex projects, design innovation, and professional practice' }
  ],
  'CE': [
    { title: 'Structural Analysis', subtitle: 'Load analysis, stress calculations, and structural design' },
    { title: 'Geotechnical Engineering', subtitle: 'Soil mechanics, foundation design, and earth structures' },
    { title: 'Hydraulics and Water Resources', subtitle: 'Fluid mechanics, water flow, and hydraulic systems' },
    { title: 'Transportation Engineering', subtitle: 'Road design, traffic engineering, and mobility planning' },
    { title: 'Construction Materials', subtitle: 'Concrete, steel, timber, and material properties' },
    { title: 'Project Management in Construction', subtitle: 'Scheduling, budgeting, and construction control' },
    { title: 'Environmental Engineering', subtitle: 'Pollution control, wastewater treatment, and environmental impact' },
    { title: 'Surveying and Mapping', subtitle: 'Land surveying, GIS, and topographic mapping' },
    { title: 'Building Information Modeling', subtitle: 'BIM implementation and construction coordination' },
    { title: 'Advanced Structural Design', subtitle: 'Complex structures, seismic design, and optimization' }
  ],
  'ME': [
    { title: 'Thermodynamics Fundamentals', subtitle: 'Heat transfer, energy systems, and thermodynamic cycles' },
    { title: 'Fluid Mechanics', subtitle: 'Flow analysis, pressure, and fluid dynamics' },
    { title: 'Machine Design', subtitle: 'Component design, fatigue analysis, and mechanical systems' },
    { title: 'Manufacturing Processes', subtitle: 'Production methods, quality control, and automation' },
    { title: 'Automotive Engineering', subtitle: 'Vehicle design, propulsion systems, and performance' },
    { title: 'Control Systems', subtitle: 'Feedback control, automation, and system dynamics' },
    { title: 'Renewable Energy Systems', subtitle: 'Solar, wind, hydroelectric, and sustainable energy' },
    { title: 'HVAC Systems Design', subtitle: 'Heating, ventilation, cooling, and environmental control' },
    { title: 'Mechanical Vibrations', subtitle: 'Vibration analysis, damping, and resonance' },
    { title: 'Engineering Project Management', subtitle: 'Project planning, execution, and quality assurance' }
  ],
  'EE': [
    { title: 'Circuit Analysis', subtitle: 'DC and AC circuit analysis, Kirchhoff laws, and network theorems' },
    { title: 'Electronics Design', subtitle: 'Semiconductors, transistors, and electronic circuit design' },
    { title: 'Power Systems', subtitle: 'Power generation, transmission, distribution, and protection' },
    { title: 'Electrical Machines', subtitle: 'Motors, generators, transformers, and rotating machinery' },
    { title: 'Signal Processing', subtitle: 'Digital and analog signal analysis and filtering' },
    { title: 'Control Engineering', subtitle: 'System modeling, feedback control, and automation' },
    { title: 'Renewable Energy Integration', subtitle: 'Solar cells, wind turbines, and smart grid systems' },
    { title: 'Electrical Safety', subtitle: 'Safety standards, grounding, and hazard analysis' },
    { title: 'Microcontroller Systems', subtitle: 'Embedded systems, microcontrollers, and real-time applications' },
    { title: 'Power Electronics', subtitle: 'Conversion circuits, power supplies, and drives' }
  ],
  'IE': [
    { title: 'Operations Management', subtitle: 'Process optimization, lean manufacturing, and efficiency' },
    { title: 'Work Study and Ergonomics', subtitle: 'Time study, motion analysis, and workplace design' },
    { title: 'Quality Management', subtitle: 'Quality control, Six Sigma, and continuous improvement' },
    { title: 'Supply Chain Management', subtitle: 'Logistics, inventory, procurement, and distribution' },
    { title: 'Production Planning and Control', subtitle: 'Scheduling, capacity planning, and resource management' },
    { title: 'Facility Layout Design', subtitle: 'Plant design, workflow optimization, and space planning' },
    { title: 'Industrial Safety', subtitle: 'Occupational safety, hazard assessment, and health standards' },
    { title: 'Decision Analysis', subtitle: 'Optimization methods, linear programming, and modeling' },
    { title: 'Maintenance Engineering', subtitle: 'Preventive maintenance, reliability, and asset management' },
    { title: 'Human Factors Engineering', subtitle: 'Human-system interaction, usability, and interface design' }
  ],
  'CHE': [
    { title: 'Chemical Process Engineering', subtitle: 'Process design, modeling, and unit operations' },
    { title: 'Organic Chemistry', subtitle: 'Organic reactions, synthesis, and reaction mechanisms' },
    { title: 'Physical Chemistry', subtitle: 'Thermodynamics, kinetics, and quantum chemistry' },
    { title: 'Analytical Chemistry', subtitle: 'Quantitative analysis, instrumentation, and testing' },
    { title: 'Biochemistry', subtitle: 'Biological molecules, metabolism, and enzyme kinetics' },
    { title: 'Chemical Kinetics', subtitle: 'Reaction rates, catalysis, and reactor design' },
    { title: 'Separation Processes', subtitle: 'Distillation, extraction, chromatography, and membrane separation' },
    { title: 'Environmental Chemistry', subtitle: 'Pollution, water treatment, and environmental remediation' },
    { title: 'Petroleum Engineering', subtitle: 'Oil extraction, refining, and petrochemical processing' },
    { title: 'Pharmaceutical Processing', subtitle: 'Drug manufacturing, formulation, and quality assurance' }
  ],
  'COE': [
    { title: 'Digital Logic Design', subtitle: 'Boolean algebra, digital circuits, and combinational logic' },
    { title: 'Microprocessor Architecture', subtitle: 'CPU design, instruction sets, and computer organization' },
    { title: 'Embedded Systems Design', subtitle: 'Microcontroller programming, firmware, and real-time systems' },
    { title: 'Computer Networking', subtitle: 'Network protocols, TCP/IP, and communication systems' },
    { title: 'VLSI Design', subtitle: 'Chip design, HDL programming, and fabrication processes' },
    { title: 'Signal Processing for Engineers', subtitle: 'DSP algorithms, filtering, and real-time implementation' },
    { title: 'Computer Architecture', subtitle: 'System design, memory hierarchy, and performance analysis' },
    { title: 'Robotics and Automation', subtitle: 'Robot control, kinematics, and automated systems' },
    { title: 'IoT Engineering', subtitle: 'Internet of Things devices, sensors, and connectivity' },
    { title: 'Hardware-Software Integration', subtitle: 'Co-design, interfacing, and system optimization' }
  ],
  'AEE': [
    { title: 'Aerodynamics Fundamentals', subtitle: 'Lift and drag, flow analysis, and wing design' },
    { title: 'Aircraft Structures', subtitle: 'Materials, stress analysis, and structural design' },
    { title: 'Propulsion Systems', subtitle: 'Jet engines, turbines, and aircraft power plants' },
    { title: 'Flight Mechanics', subtitle: 'Aircraft dynamics, stability, and control systems' },
    { title: 'Avionics Systems', subtitle: 'Navigation, communication, and aircraft instrumentation' },
    { title: 'Aircraft Design', subtitle: 'Configuration design, performance estimation, and optimization' },
    { title: 'Aerospace Materials', subtitle: 'Composites, alloys, and advanced materials' },
    { title: 'Space Systems Engineering', subtitle: 'Satellites, launch vehicles, and space missions' },
    { title: 'Manufacturing for Aerospace', subtitle: 'Aircraft production, tooling, and quality control' },
    { title: 'Aerospace Safety', subtitle: 'Reliability, redundancy, and failure analysis' }
  ],
  'BA': [
    { title: 'Business Management Fundamentals', subtitle: 'Organizational theory, planning, and strategic management' },
    { title: 'Marketing Principles', subtitle: 'Market analysis, consumer behavior, and marketing strategies' },
    { title: 'Financial Management', subtitle: 'Corporate finance, investment analysis, and financial planning' },
    { title: 'Organizational Behavior', subtitle: 'Human resources, team dynamics, and leadership' },
    { title: 'Entrepreneurship and Innovation', subtitle: 'Business planning, startup strategies, and innovation management' },
    { title: 'International Business', subtitle: 'Global markets, cross-cultural management, and trade' },
    { title: 'Business Law and Ethics', subtitle: 'Legal frameworks, corporate governance, and ethical practices' },
    { title: 'Operations and Supply Chain', subtitle: 'Process management, logistics, and optimization' },
    { title: 'Business Analytics', subtitle: 'Data analysis, business intelligence, and decision making' },
    { title: 'Strategic Planning', subtitle: 'Competitive analysis, strategic positioning, and execution' }
  ],
  'ACC': [
    { title: 'Financial Accounting', subtitle: 'Accounting principles, financial statements, and GAAP' },
    { title: 'Managerial Accounting', subtitle: 'Cost accounting, budgeting, and management reporting' },
    { title: 'Audit and Assurance', subtitle: 'Audit procedures, internal controls, and attestation' },
    { title: 'Taxation', subtitle: 'Tax law, deductions, and tax planning strategies' },
    { title: 'Advanced Financial Accounting', subtitle: 'Consolidations, partnerships, and complex transactions' },
    { title: 'Accounting Information Systems', subtitle: 'ERP systems, controls, and data management' },
    { title: 'Forensic Accounting', subtitle: 'Fraud investigation, litigation support, and evidence gathering' },
    { title: 'Government Accounting', subtitle: 'Public sector accounting, fund accounting, and compliance' },
    { title: 'International Accounting Standards', subtitle: 'IFRS, global reporting, and comparative accounting' },
    { title: 'Professional Ethics', subtitle: 'Professional responsibility, confidentiality, and independence' }
  ],
  'ENT': [
    { title: 'New Venture Creation', subtitle: 'Business planning, feasibility analysis, and launch strategy' },
    { title: 'Entrepreneurial Finance', subtitle: 'Funding sources, financial projections, and investor relations' },
    { title: 'Innovation Management', subtitle: 'Product development, market disruption, and scaling' },
    { title: 'Small Business Management', subtitle: 'Operations, marketing, and growth strategies' },
    { title: 'Strategic Partnerships', subtitle: 'Networking, collaboration, and ecosystem building' },
    { title: 'Digital Entrepreneurship', subtitle: 'Online business models, e-commerce, and digital strategy' },
    { title: 'Social Entrepreneurship', subtitle: 'Social impact, sustainability, and community development' },
    { title: 'Risk Management for Startups', subtitle: 'Risk identification, mitigation, and contingency planning' },
    { title: 'Scaling and Growth', subtitle: 'Organizational expansion, market penetration, and exit strategies' },
    { title: 'Entrepreneurial Leadership', subtitle: 'Vision setting, team building, and organizational culture' }
  ],
  'TM': [
    { title: 'Tourism Destination Management', subtitle: 'Destination marketing, cultural tourism, and sustainability' },
    { title: 'Hotel Operations', subtitle: 'Front office, housekeeping, and guest services management' },
    { title: 'Event Management', subtitle: 'Event planning, coordination, and execution' },
    { title: 'Tourism Marketing', subtitle: 'Promotion, branding, and customer acquisition strategies' },
    { title: 'Travel and Tour Operations', subtitle: 'Package design, itinerary planning, and logistics' },
    { title: 'Adventure Tourism', subtitle: 'Outdoor activities, safety, and experiential tourism' },
    { title: 'Gastronomy and Tourism', subtitle: 'Food tourism, culinary experiences, and restaurant management' },
    { title: 'Tourism Law and Regulation', subtitle: 'Legal frameworks, licensing, and compliance standards' },
    { title: 'Sustainable Tourism Development', subtitle: 'Environmental conservation, community benefit, and ethics' },
    { title: 'Tourism Technology', subtitle: 'Booking systems, tourism apps, and digital platforms' }
  ],
  'HM': [
    { title: 'Hospitality Management', subtitle: 'Hotel operations, guest services, and facility management' },
    { title: 'Food Service Management', subtitle: 'Kitchen operations, menu planning, and food cost control' },
    { title: 'Housekeeping Operations', subtitle: 'Cleaning standards, inventory, and staff training' },
    { title: 'Front Office Management', subtitle: 'Guest relations, reservations, and check-in/check-out procedures' },
    { title: 'Revenue Management', subtitle: 'Pricing strategies, occupancy optimization, and forecasting' },
    { title: 'Hotel Maintenance and Engineering', subtitle: 'Building systems, maintenance scheduling, and repairs' },
    { title: 'Banquet and Catering Services', subtitle: 'Event planning, service standards, and special functions' },
    { title: 'Human Resources in Hospitality', subtitle: 'Staff recruitment, training, and performance management' },
    { title: 'Quality Assurance in Hospitality', subtitle: 'Standards, audits, and guest satisfaction' },
    { title: 'Hospitality Marketing', subtitle: 'Guest acquisition, loyalty programs, and brand management' }
  ],
  'OA': [
    { title: 'Office Administration Fundamentals', subtitle: 'Organizational structure, procedures, and workflow management' },
    { title: 'Office Technology and Systems', subtitle: 'Business software, databases, and information systems' },
    { title: 'Records Management', subtitle: 'Document control, archiving, and information retrieval' },
    { title: 'Administrative Communication', subtitle: 'Business writing, presentations, and interpersonal skills' },
    { title: 'Office Finance and Budgeting', subtitle: 'Cost management, financial reporting, and resource planning' },
    { title: 'Executive Support Services', subtitle: 'Executive assistance, scheduling, and stakeholder management' },
    { title: 'Office Security and Compliance', subtitle: 'Data protection, confidentiality, and regulatory compliance' },
    { title: 'Procurement and Vendor Management', subtitle: 'Sourcing, contracts, and supplier relationships' },
    { title: 'Office Facilities Management', subtitle: 'Space planning, maintenance, and environmental management' },
    { title: 'Administrative Leadership', subtitle: 'Team management, process improvement, and strategic support' }
  ],
  'PA': [
    { title: 'Public Administration Fundamentals', subtitle: 'Government structure, policy, and governance' },
    { title: 'Public Finance and Budgeting', subtitle: 'Government revenue, expenditure management, and fiscal policy' },
    { title: 'Public Policy Development', subtitle: 'Policy analysis, formulation, and implementation' },
    { title: 'Public Human Resources', subtitle: 'Civil service systems, recruitment, and performance management' },
    { title: 'Administrative Law', subtitle: 'Constitutional law, regulations, and legal frameworks' },
    { title: 'Local Government Administration', subtitle: 'Municipal operations, community services, and local governance' },
    { title: 'Public Service Ethics', subtitle: 'Ethics, accountability, and public trust' },
    { title: 'Organizational Management in Government', subtitle: 'Change management, organizational development, and efficiency' },
    { title: 'Public Program Evaluation', subtitle: 'Program assessment, impact analysis, and effectiveness metrics' },
    { title: 'Strategic Government Planning', subtitle: 'Long-term planning, strategic initiatives, and implementation' }
  ],
  'NUR': [
    { title: 'Fundamentals of Nursing', subtitle: 'Patient care basics, hygiene, and safety protocols' },
    { title: 'Medical-Surgical Nursing', subtitle: 'Adult nursing care, disease management, and surgical support' },
    { title: 'Pediatric Nursing', subtitle: 'Child development, pediatric conditions, and family-centered care' },
    { title: 'Obstetric and Maternity Nursing', subtitle: 'Pregnancy, labor, delivery, and postpartum care' },
    { title: 'Psychiatric and Mental Health Nursing', subtitle: 'Mental health disorders, therapeutic communication, and care' },
    { title: 'Community Health Nursing', subtitle: 'Public health, health promotion, and preventive care' },
    { title: 'Pharmacology for Nurses', subtitle: 'Drug classifications, administration, and patient education' },
    { title: 'Nursing Leadership and Management', subtitle: 'Team coordination, delegation, and organizational skills' },
    { title: 'Pathophysiology', subtitle: 'Disease processes, organ systems, and clinical manifestations' },
    { title: 'Advanced Nursing Practice', subtitle: 'Evidence-based practice, research, and specialized nursing' }
  ],
  'PHARMA': [
    { title: 'Pharmaceutics and Dosage Forms', subtitle: 'Drug formulation, delivery systems, and pharmaceutical preparation' },
    { title: 'Pharmacology', subtitle: 'Drug interactions, mechanisms of action, and therapeutics' },
    { title: 'Medicinal Chemistry', subtitle: 'Drug design, synthesis, and structure-activity relationships' },
    { title: 'Pharmaceutical Analysis', subtitle: 'Quality control, analytical methods, and drug testing' },
    { title: 'Pharmacokinetics and Pharmacodynamics', subtitle: 'Drug absorption, distribution, and patient response' },
    { title: 'Clinical Pharmacy', subtitle: 'Patient counseling, drug therapy management, and health outcomes' },
    { title: 'Pharmacy Practice Management', subtitle: 'Pharmacy operations, dispensing, and business management' },
    { title: 'Pharmacy Law and Ethics', subtitle: 'Regulations, licensing, and professional ethics' },
    { title: 'Biopharmaceutics', subtitle: 'Biological drug products, vaccines, and biotechnology' },
    { title: 'Advanced Therapeutics', subtitle: 'Complex disease treatment and specialized pharmacotherapy' }
  ],
  'EEDUC': [
    { title: 'Child Development and Learning', subtitle: 'Developmental psychology, learning theories, and child growth' },
    { title: 'Teaching Methods for Elementary', subtitle: 'Instructional strategies, lesson planning, and classroom management' },
    { title: 'Literacy and Language Arts', subtitle: 'Reading, writing, grammar, and communication skills' },
    { title: 'Mathematics Education', subtitle: 'Numeracy, problem-solving, and mathematical concepts' },
    { title: 'Science Education', subtitle: 'Life science, physical science, and earth science instruction' },
    { title: 'Social Studies Education', subtitle: 'Civics, history, geography, and cultural awareness' },
    { title: 'Assessment and Evaluation', subtitle: 'Student testing, performance assessment, and feedback' },
    { title: 'Inclusive Education', subtitle: 'Special needs, differentiation, and diverse learner support' },
    { title: 'Educational Technology', subtitle: 'Digital tools, learning management systems, and tech integration' },
    { title: 'Professional Development in Teaching', subtitle: 'Continuous learning, reflection, and educational best practices' }
  ],
  'SEDUC': [
    { title: 'Secondary Education Pedagogy', subtitle: 'Teaching strategies, adolescent development, and instruction' },
    { title: 'Subject Matter Expertise', subtitle: 'In-depth content knowledge for specific subject areas' },
    { title: 'Curriculum Development and Design', subtitle: 'Course design, learning outcomes, and educational standards' },
    { title: 'Advanced Instructional Methods', subtitle: 'Project-based learning, critical thinking, and higher-order skills' },
    { title: 'Assessment in Secondary Education', subtitle: 'Formative assessment, summative evaluation, and grading' },
    { title: 'Classroom Management for Secondary', subtitle: 'Discipline, engagement, and positive classroom culture' },
    { title: 'Differentiated Instruction', subtitle: 'Individualized learning paths, scaffolding, and diverse needs' },
    { title: 'Technology in Secondary Teaching', subtitle: 'Digital resources, online learning, and educational apps' },
    { title: 'Student Mentoring and Guidance', subtitle: 'Academic advising, career counseling, and student support' },
    { title: 'Professional Teacher Standards', subtitle: 'Educational ethics, continuing education, and teaching excellence' }
  ]
}

const courses = []
let idCounter = 1

// generate 50 courses per program (minimum)
programDefs.forEach((p) => {
  const count = 50
  for(let i=0;i<count;i++){
    // choose a prefix (if multiple)
    const prefix = p.prefixes[i % p.prefixes.length]
    const codeNumber = 100 + (i + 1)
    const code = `${prefix}${codeNumber}`
    
    // Get realistic course name from catalog
    const catalogKey = prefix === 'N' ? 'NUR' : prefix
    const courseOptions = courseCatalog[catalogKey] || [{ title: `${p.name} Course ${i+1}`, subtitle: 'Course content and topics' }]
    const courseInfo = courseOptions[i % courseOptions.length]
    
    const title = courseInfo.title
    const subtitle = courseInfo.subtitle
    const schedule = schedules[i % schedules.length]
    const instructor = instructors[i % instructors.length]
    const units = [2,3,3,4][i % 4]
    const available = `${Math.max(5, 30 - (i % 30))}/40`
    let semester = '';
    if(i < 20) semester = '1st Semester';
    else if(i < 40) semester = '2nd Semester';
    else semester = 'Summer';
    courses.push({ id: idCounter++, program: p.name, code, title, subtitle, schedule, instructor, units, available, semester, conflict:false, enrolled:false })
  }
})

export const programList = programDefs

export const myCourses = [
  {id:1, code:'CS509', title:'Computer System', subtitle:'Introduction to Computer Science', schedule:'MWF 10:00-11:30', instructor:'Dr. Sarah Johnson', units:3},
  {id:2, code:'CS510', title:'Computer Systems', subtitle:'Advanced Topics', schedule:'MWF 10:00-11:30', instructor:'Dr. Sarah Johnson', units:3}
]

export { courses }

export const scheduleBlocks = [
  {id:1, day:'Monday', row:1, code:'GE211', title:'Ethics in the Life', time:'10:30AM-12:00PM', color:'#d1b3ff'},
  {id:2, day:'Tuesday', row:0, code:'GE201', title:'Purposive Communication', time:'9:30AM-11:00AM', color:'#a4e6ff'},
  {id:3, day:'Wednesday', row:2, code:'CSET404', title:'Industry Elective 1', time:'11:30AM-1:00PM', color:'#ffd27f'},
  {id:4, day:'Friday', row:4, code:'ITE107', title:'Technopreneurship', time:'1:30PM-3:00PM', color:'#e0f4a7'},
  {id:5, day:'Thursday', row:6, code:'CSET402', title:'Data Warehousing', time:'3:30PM-5:00PM', color:'#ff9d9d'}
]

export const payments = [
  {id:1, description:'Tuition Fee - Spring 2025', amount:1500, dueDate:'1/15/2025', status:'Pending'},
  {id:2, description:'Tuition Fee - Spring 2025', amount:1500, dueDate:'1/15/2025', status:'Pending'},
  {id:3, description:'Tuition Fee - Spring 2025', amount:1500, dueDate:'1/15/2025', status:'Overdue'}
]

export const paymentSummary = {
  totalDue: 64700,
  paidThisYear: 249600,
  upcoming: 10,
  capacity: 84
}
