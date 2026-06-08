// ═══════════════════════════════════════
//  SmartExam – script.js  (All App Logic)
// ═══════════════════════════════════════

/* ── Auth Guard ── */
(function(){
  const auth=localStorage.getItem('se_auth');
  if(!auth){window.location.href='login.html';return;}
  try{
    const {user,time}=JSON.parse(auth);
    if(Date.now()-time>8*60*60*1000){localStorage.removeItem('se_auth');window.location.href='login.html';return;}
    document.getElementById('adminName').textContent=user.charAt(0).toUpperCase()+user.slice(1);
    document.getElementById('adminAvatar').textContent=user.charAt(0).toUpperCase();
  }catch{window.location.href='login.html';}
})();

/* ── State ── */
let students   = JSON.parse(localStorage.getItem('se_students')||'[]');
let allocated  = JSON.parse(localStorage.getItem('se_allocated')||'[]');

function saveStudents(){localStorage.setItem('se_students',JSON.stringify(students));}
function saveAllocated(){localStorage.setItem('se_allocated',JSON.stringify(allocated));}

/* ── Toast Notifications ── */
function toast(msg,type='info',dur=3200){
  const icons={success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'};
  const c=document.getElementById('toastContainer');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span class="toast-icon">${icons[type]}</span>
               <span class="toast-msg">${msg}</span>
               <button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  c.appendChild(t);
  setTimeout(()=>{t.classList.add('hide');setTimeout(()=>t.remove(),350);},dur);
}

/* ── Navigation ── */
const navItems=document.querySelectorAll('.nav-item[data-panel]');
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id+'Panel').classList.add('active');
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.panel===id));
  updateTopbar(id);
  if(id==='dashboard')renderDashboardStats();
}
navItems.forEach(n=>n.addEventListener('click',()=>showPanel(n.dataset.panel)));

function updateTopbar(id){
  const titles={dashboard:'Dashboard Overview',students:'Student Entry',allocate:'Seat Allocation',collection:'Collection Sheet',reset:'Reset Data'};
  const subs={dashboard:'Manage your exam hall efficiently',students:'Add and manage student records',allocate:'Randomly allocate exam hall seats',collection:'Sorted administrative reference sheet',reset:'Clear all data and start fresh'};
  document.getElementById('topTitle').textContent=titles[id]||'SmartExam';
  document.getElementById('topSub').textContent=subs[id]||'';
}

/* ── Logout ── */
document.getElementById('logoutBtn').addEventListener('click',()=>openModal());
function openModal(){document.getElementById('confirmModal').classList.add('open');}
document.getElementById('cancelLogout').addEventListener('click',()=>document.getElementById('confirmModal').classList.remove('open'));
document.getElementById('doLogout').addEventListener('click',()=>{localStorage.removeItem('se_auth');window.location.href='login.html';});

/* ── Dept colour helper ── */
const DEPTS=['AIML','CSE','ECE','EEE','MECH','CIVIL','IT','MBA','MCA'];
function deptBadge(d){return `<span class="dept-badge dept-${d}">${d}</span>`;}

/* ══════════════════════════════════════
   DASHBOARD STATS
══════════════════════════════════════ */
function renderDashboardStats(){
  document.getElementById('statStudents').textContent=students.length;
  document.getElementById('statAllocated').textContent=allocated.length;
  const deptSet=new Set(students.map(s=>s.dept));
  document.getElementById('statDepts').textContent=deptSet.size;
  document.getElementById('statSeats').textContent=allocated.length>0?allocated.length:'—';
  // topbar pills
  document.getElementById('pillStudents').textContent=students.length+' Students';
  document.getElementById('pillAllocated').textContent=allocated.length+' Allocated';
}

/* ── Quick action cards ── */
document.querySelectorAll('.action-card[data-go]').forEach(c=>{
  c.addEventListener('click',()=>showPanel(c.dataset.go));
});

/* ══════════════════════════════════════
   STUDENT ENTRY
══════════════════════════════════════ */
const rollInput=document.getElementById('rollInput');
const deptSelect=document.getElementById('deptSelect');
const addMsg=document.getElementById('addMsg');

document.getElementById('addStudentBtn').addEventListener('click',addStudent);
rollInput.addEventListener('keydown',e=>{if(e.key==='Enter')addStudent();});

function addStudent(){
  const roll=rollInput.value.trim().toUpperCase();
  const dept=deptSelect.value;
  addMsg.className='validation-msg';
  if(!roll){addMsg.className='validation-msg error';addMsg.textContent='Roll number cannot be empty.';return;}
  if(!dept){addMsg.className='validation-msg error';addMsg.textContent='Please select a department.';return;}
  if(!/^[A-Z0-9\/\-_]+$/.test(roll)){addMsg.className='validation-msg error';addMsg.textContent='Roll number contains invalid characters.';return;}
  if(students.find(s=>s.roll===roll)){addMsg.className='validation-msg error';addMsg.textContent=`Roll number "${roll}" already exists.`;return;}
  students.push({roll,dept,addedAt:Date.now()});
  saveStudents();
  addMsg.className='validation-msg success';
  addMsg.textContent=`✓ ${roll} (${dept}) added successfully!`;
  rollInput.value='';
  rollInput.focus();
  renderStudentTable();
  updateNavBadges();
  toast(`Added ${roll} – ${dept}`,'success');
}

function removeStudent(roll){
  students=students.filter(s=>s.roll!==roll);
  saveStudents();
  // also clear allocation if it was done
  if(allocated.length){allocated=[];saveAllocated();}
  renderStudentTable();
  updateNavBadges();
  toast(`Removed ${roll}`,'warning');
}

function renderStudentTable(){
  const tbody=document.getElementById('studentTbody');
  if(students.length===0){
    tbody.innerHTML=`<tr><td colspan="4"><div class="empty-state">
      <div class="empty-icon">🎓</div>
      <p>No students added yet</p>
      <small>Use the form above to add students</small>
    </div></td></tr>`;
    return;
  }
  tbody.innerHTML=students.map((s,i)=>`
    <tr style="animation-delay:${i*40}ms">
      <td>${i+1}</td>
      <td style="font-family:var(--mono);font-size:.88rem">${s.roll}</td>
      <td>${deptBadge(s.dept)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="removeStudent('${s.roll}')">✕ Remove</button></td>
    </tr>`).join('');
  document.getElementById('studentCount').textContent=students.length;
}

function updateNavBadges(){
  document.getElementById('badgeStudents').textContent=students.length;
  document.getElementById('badgeAllocated').textContent=allocated.length;
}

/* CSV Import */
document.getElementById('csvFile').addEventListener('change',function(){
  const file=this.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const lines=e.target.result.split('\n').filter(l=>l.trim());
    let added=0,skipped=0;
    lines.forEach(line=>{
      const parts=line.split(',');
      const roll=(parts[0]||'').trim().toUpperCase();
      const dept=(parts[1]||'').trim().toUpperCase();
      if(!roll||!DEPTS.includes(dept)||students.find(s=>s.roll===roll)){skipped++;return;}
      students.push({roll,dept,addedAt:Date.now()});added++;
    });
    saveStudents();renderStudentTable();updateNavBadges();
    toast(`CSV: ${added} added, ${skipped} skipped`,'info');
    this.value='';
  };
  reader.readAsText(file);
});

/* ══════════════════════════════════════
   SEAT ALLOCATION
══════════════════════════════════════ */
document.getElementById('allocateBtn').addEventListener('click',allocateSeats);
document.getElementById('reshuffleBtn').addEventListener('click',()=>{
  if(allocated.length===0){toast('Allocate seats first.','warning');return;}
  allocateSeats();toast('Seats reshuffled!','info');
});

function allocateSeats(){
  if(students.length===0){
    document.getElementById('seatGrid').innerHTML=`<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">💺</div><p>No students found</p>
      <small>Add students in the Student Entry section first.</small></div>`;
    toast('No students to allocate.','warning');return;
  }
  // Fisher-Yates shuffle
  const shuffled=[...students];
  for(let i=shuffled.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
  }
  allocated=shuffled.map((s,i)=>({seatNo:i+1,...s}));
  saveAllocated();
  renderSeatGrid();
  updateNavBadges();
  toast(`${allocated.length} seats allocated successfully!`,'success');
}

function renderSeatGrid(){
  const grid=document.getElementById('seatGrid');
  if(allocated.length===0){
    grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">💺</div><p>No allocation done yet</p>
      <small>Click "Allocate Seats" to randomise seating.</small></div>`;
    return;
  }
  grid.innerHTML=allocated.map((a,i)=>`
    <div class="seat-card" style="animation-delay:${i*60}ms">
      <div class="seat-number">Seat ${a.seatNo}</div>
      <div class="seat-roll">${a.roll}</div>
      <div class="seat-dept">${deptBadge(a.dept)}</div>
    </div>`).join('');
  document.getElementById('allocatedCount').textContent=allocated.length+' seats';
}

/* ══════════════════════════════════════
   COLLECTION SHEET
══════════════════════════════════════ */
document.getElementById('genCollectionBtn').addEventListener('click',generateCollection);
document.getElementById('printBtn').addEventListener('click',()=>{
  showPanel('collection');generateCollection();setTimeout(()=>window.print(),400);
});

function generateCollection(){
  if(students.length===0){
    document.getElementById('collectionTbody').innerHTML=
      `<tr><td colspan="3"><div class="empty-state"><div class="empty-icon">📋</div>
        <p>No students to display</p><small>Add students first.</small></div></td></tr>`;
    toast('No students to generate collection sheet.','warning');return;
  }
  const sorted=[...students].sort((a,b)=>a.roll.localeCompare(b.roll,undefined,{numeric:true,sensitivity:'base'}));
  const tbody=document.getElementById('collectionTbody');
  tbody.innerHTML=sorted.map((s,i)=>`
    <tr class="collection-table" style="animation-delay:${i*30}ms">
      <td class="sno">${i+1}</td>
      <td style="font-family:var(--mono);font-size:.88rem;font-weight:600">${s.roll}</td>
      <td>${deptBadge(s.dept)}</td>
    </tr>`).join('');
  document.getElementById('collectionCount').textContent=sorted.length+' records';
  toast('Collection sheet generated (sorted by Roll No)!','success');
}

/* ══════════════════════════════════════
   RESET DATA
══════════════════════════════════════ */
document.getElementById('resetStudentsBtn').addEventListener('click',()=>{
  if(students.length===0){toast('Student list is already empty.','info');return;}
  if(confirm(`Reset all ${students.length} students? This cannot be undone.`)){
    students=[];allocated=[];saveStudents();saveAllocated();
    renderStudentTable();renderSeatGrid();updateNavBadges();
    toast('All student data cleared.','warning');
  }
});
document.getElementById('resetAllBtn').addEventListener('click',()=>{
  if(confirm('Reset ALL data including students and allocations? This cannot be undone.')){
    students=[];allocated=[];
    localStorage.removeItem('se_students');
    localStorage.removeItem('se_allocated');
    renderStudentTable();renderSeatGrid();updateNavBadges();
    toast('All data has been reset.','warning');
  }
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderDashboardStats();
renderStudentTable();
renderSeatGrid();
updateNavBadges();
showPanel('dashboard');
