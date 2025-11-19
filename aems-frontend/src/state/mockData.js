export const courses = [
  {id:1, program:'Computer Science', code:'CS101', title:'Introduction to Computer Science', subtitle:'Foundations and problem solving', schedule:'MWF 08:00-09:30', instructor:'Dr. Sarah Johnson', units:3, available:'40/50', conflict:false, enrolled:false},
  {id:2, program:'Computer Science', code:'CS102', title:'Computer Systems', subtitle:'Hardware and OS basics', schedule:'TTh 10:00-11:30', instructor:'Prof. Liam Cruz', units:3, available:'35/40', conflict:false, enrolled:false},
  {id:3, program:'Computer Science', code:'CS201', title:'Data Structures', subtitle:'Lists, trees, graphs', schedule:'MWF 11:00-12:30', instructor:'Dr. Alice Monroe', units:3, available:'25/35', conflict:false, enrolled:false},
  {id:4, program:'Computer Science', code:'CS202', title:'Algorithms', subtitle:'Sorting, searching, complexity', schedule:'TTh 13:00-14:30', instructor:'Prof. Ken Ito', units:3, available:'28/40', conflict:false, enrolled:false},
  {id:5, program:'Information Technology', code:'IT101', title:'Intro to IT', subtitle:'Systems and networking overview', schedule:'MWF 09:30-11:00', instructor:'Dr. Mei Lin', units:3, available:'30/40', conflict:false, enrolled:false},
  {id:6, program:'Information Technology', code:'IT210', title:'Network Fundamentals', subtitle:'LAN/WAN and protocols', schedule:'TTh 08:00-09:30', instructor:'Engr. Daniel Park', units:3, available:'20/30', conflict:false, enrolled:false},
  {id:7, program:'Information Technology', code:'IT317', title:'Emerging Technologies', subtitle:'IoT and cloud basics', schedule:'Sat 09:00-12:00', instructor:'Dr. Mei Lin', units:2, available:'20/30', conflict:false, enrolled:false},
  {id:8, program:'Engineering', code:'ENGR101', title:'Engineering Math I', subtitle:'Calculus for engineers', schedule:'MWF 13:00-14:30', instructor:'Prof. Michael Chen', units:4, available:'18/25', conflict:false, enrolled:false},
  {id:9, program:'Engineering', code:'ENGR102', title:'Physics for Engineers', subtitle:'Mechanics and waves', schedule:'TTh 11:00-12:30', instructor:'Dr. Nora Quinn', units:4, available:'22/30', conflict:false, enrolled:false},
  {id:10, program:'Engineering', code:'ENGR201', title:'Statics', subtitle:'For mechanical structures', schedule:'MWF 15:00-16:30', instructor:'Prof. Omar Reyes', units:3, available:'12/25', conflict:false, enrolled:false},
  {id:11, program:'Accounting', code:'ACC101', title:'Financial Accounting', subtitle:'Intro to financial statements', schedule:'TTh 09:30-11:00', instructor:'Dr. Elena Cruz', units:3, available:'40/50', conflict:false, enrolled:false},
  {id:12, program:'Accounting', code:'ACC201', title:'Managerial Accounting', subtitle:'Cost behavior and budgeting', schedule:'MWF 10:00-11:30', instructor:'Prof. Greg Tan', units:3, available:'30/40', conflict:false, enrolled:false},
  {id:13, program:'Tourism', code:'TOUR101', title:'Intro to Tourism', subtitle:'History and trends', schedule:'TTh 14:00-15:30', instructor:'Dr. Maria Gomez', units:3, available:'25/30', conflict:false, enrolled:false},
  {id:14, program:'Tourism', code:'TOUR210', title:'Tour Operations', subtitle:'Planning and management', schedule:'MWF 12:00-13:30', instructor:'Ms. Liza Mar', units:3, available:'20/25', conflict:false, enrolled:false},
  {id:15, program:'Hospitality Management', code:'HM101', title:'Hospitality Basics', subtitle:'Front office and service', schedule:'TTh 10:00-11:30', instructor:'Mr. John Reyes', units:3, available:'30/40', conflict:false, enrolled:false},
  {id:16, program:'Hospitality Management', code:'HM220', title:'Food & Beverage Ops', subtitle:'Kitchen and service management', schedule:'Sat 13:00-16:00', instructor:'Chef Anna Li', units:3, available:'18/25', conflict:false, enrolled:false},
  {id:17, program:'Nursing', code:'NUR101', title:'Anatomy & Physiology I', subtitle:'Foundations of human biology', schedule:'MWF 08:30-10:00', instructor:'Dr. Paula Santos', units:4, available:'22/30', conflict:false, enrolled:false},
  {id:18, program:'Nursing', code:'NUR102', title:'Fundamentals of Nursing', subtitle:'Basic patient care', schedule:'TTh 12:00-13:30', instructor:'Prof. Lorna Day', units:3, available:'24/30', conflict:false, enrolled:false},
  {id:19, program:'Computer Science', code:'CS301', title:'Operating Systems', subtitle:'Processes, threads, scheduling', schedule:'MWF 14:00-15:30', instructor:'Dr. Sarah Johnson', units:3, available:'18/30', conflict:false, enrolled:false},
  {id:20, program:'Computer Science', code:'CS302', title:'Databases', subtitle:'Relational models and SQL', schedule:'TTh 15:00-16:30', instructor:'Prof. Ken Ito', units:3, available:'26/35', conflict:false, enrolled:false},
  {id:21, program:'Computer Science', code:'CS401', title:'Machine Learning', subtitle:'Intro to ML concepts', schedule:'MWF 09:00-10:30', instructor:'Dr. Ava Patel', units:3, available:'15/25', conflict:false, enrolled:false},
  {id:22, program:'Information Technology', code:'IT401', title:'Cybersecurity', subtitle:'Security principles and practice', schedule:'TTh 16:00-17:30', instructor:'Engr. Daniel Park', units:3, available:'20/30', conflict:false, enrolled:false},
  {id:23, program:'Engineering', code:'ME101', title:'Intro to Mechanical Eng', subtitle:'Design and materials', schedule:'MWF 11:00-12:30', instructor:'Prof. Carlos Dela Cruz', units:3, available:'17/25', conflict:false, enrolled:false},
  {id:24, program:'Engineering', code:'EE201', title:'Circuits I', subtitle:'Circuit analysis', schedule:'TTh 08:30-10:00', instructor:'Dr. Irene Gomez', units:3, available:'20/28', conflict:false, enrolled:false},
  {id:25, program:'Accounting', code:'ACC301', title:'Taxation', subtitle:'Corporate and individual tax', schedule:'MWF 13:00-14:30', instructor:'Prof. Greg Tan', units:3, available:'22/30', conflict:false, enrolled:false},
  {id:26, program:'Accounting', code:'ACC401', title:'Auditing', subtitle:'Standards and procedures', schedule:'TTh 11:30-13:00', instructor:'Dr. Elena Cruz', units:3, available:'15/20', conflict:false, enrolled:false},
  {id:27, program:'Tourism', code:'TOUR310', title:'Ecotourism', subtitle:'Sustainable travel', schedule:'MWF 15:00-16:30', instructor:'Ms. Liza Mar', units:3, available:'18/25', conflict:false, enrolled:false},
  {id:28, program:'Hospitality Management', code:'HM301', title:'Hotel Management', subtitle:'Operations and strategy', schedule:'TTh 09:00-10:30', instructor:'Mr. John Reyes', units:3, available:'20/30', conflict:false, enrolled:false},
  {id:29, program:'Nursing', code:'NUR201', title:'Pharmacology', subtitle:'Drug classes and administration', schedule:'MWF 10:30-12:00', instructor:'Dr. Paula Santos', units:3, available:'18/25', conflict:false, enrolled:false},
  {id:30, program:'Nursing', code:'NUR301', title:'Medical-Surgical Nursing', subtitle:'Adult patient care', schedule:'TTh 14:00-15:30', instructor:'Prof. Lorna Day', units:4, available:'12/20', conflict:false, enrolled:false},
  {id:31, program:'Computer Science', code:'CS303', title:'Software Engineering', subtitle:'Design patterns and lifecycle', schedule:'MWF 16:00-17:30', instructor:'Dr. Ava Patel', units:3, available:'14/25', conflict:false, enrolled:false},
  {id:32, program:'Information Technology', code:'IT305', title:'Web Technologies', subtitle:'Frontend and backend basics', schedule:'TTh 13:30-15:00', instructor:'Ms. Jenna Cruz', units:3, available:'26/30', conflict:false, enrolled:false},
  {id:33, program:'Engineering', code:'CE201', title:'Fluid Mechanics', subtitle:'Flow principles', schedule:'MWF 09:00-10:30', instructor:'Prof. Omar Reyes', units:3, available:'20/25', conflict:false, enrolled:false},
  {id:34, program:'Engineering', code:'ENGR301', title:'Thermodynamics', subtitle:'Energy systems', schedule:'TTh 15:00-16:30', instructor:'Dr. Nora Quinn', units:3, available:'16/22', conflict:false, enrolled:false},
  {id:35, program:'Accounting', code:'ACC205', title:'Accounting Information Systems', subtitle:'Tech in accounting', schedule:'MWF 12:30-14:00', instructor:'Prof. Greg Tan', units:3, available:'24/30', conflict:false, enrolled:false},
  {id:36, program:'Tourism', code:'TOUR205', title:'Cultural Heritage Tourism', subtitle:'Sites and preservation', schedule:'TTh 08:00-09:30', instructor:'Dr. Maria Gomez', units:3, available:'18/25', conflict:false, enrolled:false},
  {id:37, program:'Hospitality Management', code:'HM210', title:'Event Management', subtitle:'Planning large events', schedule:'MWF 14:00-15:30', instructor:'Chef Anna Li', units:3, available:'20/30', conflict:false, enrolled:false},
  {id:38, program:'Nursing', code:'NUR401', title:'Community Health Nursing', subtitle:'Population health', schedule:'TTh 16:00-17:30', instructor:'Dr. Paula Santos', units:3, available:'18/25', conflict:false, enrolled:false},
  {id:39, program:'Computer Science', code:'CS404', title:'Computer Networks', subtitle:'Protocols and architectures', schedule:'MWF 08:00-09:30', instructor:'Prof. Ken Ito', units:3, available:'22/30', conflict:false, enrolled:false},
  {id:40, program:'Information Technology', code:'IT450', title:'Cloud Computing', subtitle:'Services and deployment', schedule:'TTh 10:30-12:00', instructor:'Engr. Daniel Park', units:3, available:'20/30', conflict:false, enrolled:false},
  {id:41, program:'Engineering', code:'ENGR410', title:'Control Systems', subtitle:'Feedback and stability', schedule:'MWF 11:30-13:00', instructor:'Dr. Irene Gomez', units:3, available:'15/20', conflict:false, enrolled:false},
  {id:42, program:'Accounting', code:'ACC320', title:'Financial Analysis', subtitle:'Investment and valuation', schedule:'TTh 13:00-14:30', instructor:'Dr. Elena Cruz', units:3, available:'18/25', conflict:false, enrolled:false},
  {id:43, program:'Tourism', code:'TOUR410', title:'Tourism Marketing', subtitle:'Branding destinations', schedule:'MWF 15:30-17:00', instructor:'Ms. Liza Mar', units:3, available:'12/20', conflict:false, enrolled:false},
  {id:44, program:'Hospitality Management', code:'HM410', title:'Hospitality Finance', subtitle:'Costs and revenue management', schedule:'TTh 09:30-11:00', instructor:'Mr. John Reyes', units:3, available:'16/22', conflict:false, enrolled:false},
  {id:45, program:'Nursing', code:'NUR305', title:'Pediatric Nursing', subtitle:'Child health care', schedule:'MWF 10:00-11:30', instructor:'Prof. Lorna Day', units:3, available:'14/20', conflict:false, enrolled:false},
  {id:46, program:'Computer Science', code:'CS405', title:'Distributed Systems', subtitle:'Coordination and consistency', schedule:'TTh 15:30-17:00', instructor:'Dr. Ava Patel', units:3, available:'10/18', conflict:false, enrolled:false},
  {id:47, program:'Information Technology', code:'IT499', title:'Capstone Project', subtitle:'Industry-sponsored project', schedule:'Sat 09:00-12:00', instructor:'Ms. Jenna Cruz', units:3, available:'8/12', conflict:false, enrolled:false},
  {id:48, program:'Engineering', code:'ENGR499', title:'Engineering Capstone', subtitle:'Design project', schedule:'Sat 13:00-16:00', instructor:'Prof. Michael Chen', units:3, available:'10/12', conflict:false, enrolled:false},
  {id:49, program:'Accounting', code:'ACC499', title:'Accounting Capstone', subtitle:'Practicum and review', schedule:'MWF 16:00-17:30', instructor:'Dr. Elena Cruz', units:3, available:'10/15', conflict:false, enrolled:false},
  {id:50, program:'Tourism', code:'TOUR499', title:'Tourism Thesis', subtitle:'Research in tourism studies', schedule:'TTh 14:30-16:00', instructor:'Dr. Maria Gomez', units:3, available:'6/10', conflict:false, enrolled:false}
]

export const myCourses = [
  {id:1, code:'CS509', title:'Computer System', subtitle:'Introduction to Computer Science', schedule:'MWF 10:00-11:30', instructor:'Dr. Sarah Johnson', units:3},
  {id:2, code:'CS509', title:'Computer Systems', subtitle:'Advanced Topics', schedule:'MWF 10:00-11:30', instructor:'Dr. Sarah Johnson', units:3}
]

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
