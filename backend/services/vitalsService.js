const HR_R = {
  adult: { mn: 60, mx: 100 },
  newborn: { mn: 70, mx: 190 },
  infant: { mn: 80, mx: 160 },
  toddler: { mn: 80, mx: 130 },
  child: { mn: 70, mx: 120 },
  teen: { mn: 60, mx: 100 }
};

const analyzeHeartRate = (val, grp) => {
  const r = HR_R[grp] || HR_R.adult;
  if(val < r.mn) return { status: 'Low', risk: 'possible bradycardia risk', lv: 'Medium' };
  if(val > r.mx) return { status: 'High', risk: 'possible tachycardia risk', lv: 'High' };
  return { status: 'Normal', risk: null, lv: null };
};

const analyzeBP = (raw) => {
  const p = raw.split('/');
  if(p.length < 2) return null;
  const sys = parseInt(p[0]), dia = parseInt(p[1]);
  if(isNaN(sys) || isNaN(dia)) return null;
  if(sys < 90) return { status: 'Low BP', risk: 'possible hypotension risk', lv: 'High', sys };
  if(sys <= 120 && dia <= 80) return { status: 'Normal', risk: null, lv: null, sys };
  if(sys <= 129) return { status: 'Elevated', risk: 'possible elevated BP', lv: 'Medium', sys };
  return { status: 'High BP', risk: 'possible hypertension risk', lv: 'High', sys };
};

const analyzeOxygen = (val) => {
  if(val >= 95) return { status: 'Normal', risk: null, lv: null };
  if(val >= 90) return { status: 'Low', risk: 'possible respiratory concern', lv: 'Medium' };
  return { status: 'Critical Low', risk: 'possible severe respiratory emergency', lv: 'High', em: true };
};

const analyzeSugar = (val) => {
  if(val < 70) return { status: 'Low', risk: 'possible hypoglycemia risk', lv: 'High' };
  if(val <= 140) return { status: 'Normal', risk: null, lv: null };
  if(val <= 200) return { status: 'High', risk: 'possible hyperglycemia risk', lv: 'Medium' };
  return { status: 'Very High', risk: 'possible severe hyperglycemia', lv: 'High', em: true };
};

const analyzeTemp = (val) => {
  if(val < 95) return { status: 'Low Temp', fever: false, risk: 'possible hypothermia', lv: 'High' };
  if(val < 100) return { status: 'Normal', fever: false, risk: null, lv: null };
  if(val <= 102) return { status: 'Fever Detected', fever: true, risk: 'possible infection / fever', lv: 'Medium' };
  return { status: 'High Risk Fever', fever: true, risk: 'HIGH RISK FEVER — EMERGENCY', lv: 'High', em: true };
};

const evaluateVitals = (vitals) => {
  const { heartRate, bloodPressure, oxygen, sugar, temperature, ageGroup } = vitals;
  let risks = [];
  let emgs = [];
  let conditions = [];
  
  if (heartRate != null) {
    const r = analyzeHeartRate(heartRate, ageGroup);
    if(r.risk) risks.push(`Heart Rate: ${heartRate} bpm -> ${r.risk}`);
    if(heartRate > 150 || heartRate < 40) emgs.push(`Heart rate critical: ${heartRate} bpm`);
    conditions.push(`Heart Rate: ${r.status}`);
  }

  if (bloodPressure) {
    const r = analyzeBP(bloodPressure);
    if(r) {
      if(r.risk) risks.push(`BP: ${bloodPressure} mmHg -> ${r.risk}`);
      if(r.sys >= 180) emgs.push(`BP critically high: ${bloodPressure}`);
      conditions.push(`BP: ${r.status}`);
    }
  }

  if (oxygen != null) {
    const r = analyzeOxygen(oxygen);
    if(r.risk) risks.push(`Oxygen: ${oxygen}% -> ${r.risk}`);
    if(r.em) emgs.push(`Oxygen critically low: ${oxygen}%`);
    conditions.push(`Oxygen: ${r.status}`);
  }

  if (sugar != null) {
    const r = analyzeSugar(sugar);
    if(r.risk) risks.push(`Sugar: ${sugar} mg/dL -> ${r.risk}`);
    if(r.em) emgs.push(`Blood sugar dangerously high: ${sugar} mg/dL`);
    conditions.push(`Sugar: ${r.status}`);
  }

  if (temperature != null) {
    const r = analyzeTemp(temperature);
    if(r.risk) risks.push(`Temp: ${temperature}°F -> ${r.risk}`);
    if(r.em) emgs.push(`Temperature high risk: ${temperature}°F`);
    conditions.push(`Temperature: ${r.status}`);
  }

  const isEmergency = emgs.length > 0;
  const hasHighRisk = risks.length > 0;
  let overallStatus = 'Normal';
  if (isEmergency) overallStatus = 'Critical';
  else if (hasHighRisk) overallStatus = 'High';

  let nextAction = [];
  if (isEmergency) {
    nextAction.push('🚨 Seek emergency care immediately');
    nextAction.push('🚑 Call ambulance: 108 or 112');
  } else if (hasHighRisk) {
    nextAction.push('👨‍⚕️ Schedule urgent doctor appointment today');
  } else {
    nextAction.push('✅ Continue monitoring regularly');
  }

  return {
    overallStatus,
    conditionNow: conditions,
    risks,
    nextAction,
    isEmergency,
    emgs
  };
};

module.exports = {
  evaluateVitals
};
