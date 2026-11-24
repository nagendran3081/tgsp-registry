const P=[['empid','Employee ID'],['name','Employee Name'],['father','Father Name'],['post','Present Post'],['genno','General No'],['dob','Date of Birth','d'],['dor','Date of Retirement','d'],['doa','Date of Appointment','d'],['drp','Date of Reporting (Present Posting)','d'],['dono','Posting D.O No'],['dodate','Posting D.O Date','d'],['phone','Phone No'],['cug','Govt CUG'],['email','Email'],['aadhaar','Aadhaar (masked, last 4)'],['loc','Present Posting Location'],['district','Native District'],['gender','Gender','s',['Male','Female','Other']],['marital','Marital Status','s',['Single','Married','Widowed','Divorced']],['caste','Caste'],['subcaste','Sub Caste'],['blood','Blood Group'],['mark1','Identification Mark 1'],['mark2','Identification Mark 2'],['bhadratha','Bhadratha/Arogya No'],['coop','Co-operative A/c No'],['paddr','Permanent Address','a'],['raddr','Residential Address','a'],['dl','Driving License No'],['pan','PAN (masked)'],['religion','Religion'],['nation','Nationality'],['gpf','GPF No'],['cps','CPS No'],['ophone','Office Phone'],['omobile','Office Mobile'],['tsemail','TSPOLICE Email'],['recruit','Recruitment Type','s',['Direct','Compassionate','Transfer','Other']]];
const LV=[['from','From Date','d'],['to','To Date','d'],['days','No. of Days'],['dono','D.O No'],['dodate','D.O Date','d'],['rem','Remarks']];
const T=[
['lb','Leave Balance',[['el','Earned Leave'],['hpl','Half Pay Leave'],['cl','Commuted Leave'],['sl','Special Leave']]],
['edu','Education Details',[['type','Education Type'],['name','Education Name']]],
['dep','Dependent Details',[['name','Dependent Name'],['gender','Gender'],['dob','D.O.B','d'],['age','Age'],['rel','Relation Type'],['nom','Nominee']]],
['pst','Posting Details',[['to','Posting To'],['off','CP/SP Office'],['loc','Posting Location'],['rank','Rank'],['from','From Date','d'],['end','End Date','d'],['rem','Remarks'],['tt','Transfer Type'],['dur','Duration']]],
['att','Attachment Details',[['to','Posting To'],['off','CP/SP Office'],['att','Attached To'],['from','From Date','d'],['end','End Date','d'],['rem','Remarks']]],
['prm','Promotions Details',[['dono','D.O No'],['dodate','D.O Date','d'],['rep','Date of Reporting at HO','d'],['rank','Promoted Rank'],['rem','Remarks']]],
['prb','Probation Details',[['rank','Rank'],['dodate','Probation DO Date','d'],['dono','Probation DO No'],['comp','Date of Completion','d'],['alist','Date Brought on to A List','d'],['rem','Probation Remarks']]],
['rwd','Rewards Details',[['rwd','Rewards'],['amt','Amount'],['dono','D.O No'],['dodate','D.O Date','d'],['rem','Remarks']]],
['pen','Penalty Details',[['pen','Penalty'],['dono','D.O No'],['dodate','D.O Date','d'],['status','Penalty Status'],['rem','Remarks']]],
['trn','Training Details',[['name','Training Name'],['center','Training Center Name'],['start','Start Date','d'],['end','End Date','d']]],
['skl','Skills Details',[['type','Skill Type'],['name','Skill Name']]],
['lng','Language Details',[['name','Language Name'],['read','Read'],['write','Write'],['speak','Speak']]],
['bnk','Payment Bank Details',[['bank','Bank'],['branch','Branch'],['ifsc','IFSC'],['micr','MICR'],['acc','Account Number (masked)']]],
['el','Earned Leave Details',LV],
['hpl','Half Pay Leave Details',LV],
['sur','Surrender Leave Details',LV],
['eol','Extra Ordinary Leave Details',[['type','Type'],['from','From Date','d'],['to','To Date','d'],['dono','D.O No/Memo No'],['dodate','D.O Date','d'],['rem','Remarks']]],
['ltc','Leave Travel Concession Details',LV],
['sick','Sick Settlement Details',LV],
['scl','Special Casual Leave Details',LV],
['grv','Grievance Details',[['ack','Acknowledge No'],['date','Creation Date','d'],['file','File No'],['cat','Category / Sub Category'],['msg','Message'],['status','Status']]],
['inc','Increment',[['type','Increment Type'],['basic','Basic Pay'],['scale','Scale of Pay'],['rate','Increment Rate'],['date','Increment Date','d']]],
['tsg','TSGLI No Details',[['pol','TSGLI/Policy Number'],['sum','Sum Assured']]],
['vac','Vaccination Details',[['name','Name'],['age','Age'],['rel','Relation'],['stat','Vaccine Status'],['type','Vaccine Type'],['cen','Center Name'],['cowin','Cowin Ben No'],['d1','Dose 1 Date','d'],['d1c','Dose 1 Center'],['d2','Dose 2 Date','d'],['d2c','Dose 2 Center'],['p1','First +ve Date','d'],['p2','Second +ve Date','d']]],
['prc','PRC Details',[['rank','Rank'],['doj','Date of Join in Service','d'],['esc','Existing Scale of Pay'],['epay','Existing Pay as on date of Option'],['da','DA as on 1.7.2018 @30.392%'],['fit','Fitment benefit @30%'],['tot','Total emoluments'],['fixed','Pay fixed at next stage (PRC2020)'],['rsc','Revised Scale of Pay'],['inc','Next Increments Sanctioned']]],
['abs','Employee Absent Reporting Details',[['status','Employee status update to'],['dono','D.O No'],['dodate','D.O Date','d'],['rem','Remarks']]]
];
const SH=[['personal','Personal Details',P.map(p=>[p[0],p[1],p[2]=='d'?'d':'t'])]].concat(T.map(t=>[t[0],t[1],[['empid','Employee ID','t']].concat(t[2].map(c=>[c[0],c[1],c[2]=='d'?'d':'t']))]));
const nd=v=>{v=(v||'').trim();let m=/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/.exec(v);if(m)return m[1].padStart(2,'0')+'/'+m[2].padStart(2,'0')+'/'+m[3];m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(v);return m?m[3]+'/'+m[2]+'/'+m[1]:v};
