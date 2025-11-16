export const courses = [
  {id:1, code:'CS102', title:'Computer System', subtitle:'Introduction to Computer Science', schedule:'MWF 10:00-11:30', instructor:'Dr. Sarah Johnson', units:3, available:'25/50', conflict:false, enrolled:false},
  {id:2, code:'CS101', title:'Computer History', subtitle:'Introduction to Computer Science', schedule:'TTh 08:00-09:30', instructor:'Dr. Sarah Johnson', units:3, available:'35/50', conflict:true, enrolled:false},
  {id:3, code:'CS202', title:'Data Structures', subtitle:'Core Algorithms', schedule:'MWF 13:00-14:30', instructor:'Prof. Liam Cruz', units:3, available:'15/40', conflict:false, enrolled:false},
  {id:4, code:'IT317', title:'Industry Elective', subtitle:'Emerging Tech', schedule:'Sat 09:00-12:00', instructor:'Dr. Mei Lin', units:2, available:'20/30', conflict:false, enrolled:false}
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
