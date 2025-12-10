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
    const title = `${p.name.split(' - ')[0]} Subject ${i+1}`
    const subtitle = `Overview and topics for ${title}`
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
