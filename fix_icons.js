const fs = require('fs');

const mockDataPath = './src/data/mockData.ts';
let content = fs.readFileSync(mockDataPath, 'utf8');

// I will just use a regex to replace the broken "icon": "..." fields with sequential biology icons.
const bioIcons = [
  "FaHeartPulse",
  "FaBrain",
  "FaBone",
  "FaLungs",
  "FaStethoscope",
  "FaBaby",
  "FaEye",
  "FaEarDeaf",
  "FaTooth",
  "GiKidneys",
  "GiStomach",
  "GiLiver",
  "FaUserDoctor",
  "FaMicroscope",
  "FaSyringe",
  "FaPills",
  "FaDna",
  "FaVial",
  "FaVials",
  "FaHeartbeat",
  "FaBriefcaseMedical",
  "FaHospitalUser",
  "FaLungsVirus",
  "FaStaffSnake",
  "GiHeartOrgan",
  "GiBrain",
  "GiLungs",
  "GiBoneMarrow",
  "FaHeadSideMask",
  "FaTruckMedical"
];

let iconIndex = 0;
content = content.replace(/"icon":\s*".*?"/g, () => {
  const replacement = `"icon": "${bioIcons[iconIndex % bioIcons.length]}"`;
  iconIndex++;
  return replacement;
});

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('Fixed icons in mockData.ts');
