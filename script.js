let macroChart;

function toggleUnits() {
  const units = document.getElementById('units').value;
  if(units === 'imperial') {
    document.getElementById('weightLabel').innerText = 'Peso (libras)';
    document.getElementById('metricHeightGroup').classList.add('d-none');
    document.getElementById('imperialHeightGroup').classList.remove('d-none');
  } else {
    document.getElementById('weightLabel').innerText = 'Peso (kg)';
    document.getElementById('metricHeightGroup').classList.remove('d-none');
    document.getElementById('imperialHeightGroup').classList.add('d-none');
  }
}

function calculate() {
  const errorBox = document.getElementById('errorBox');
  errorBox.classList.add('d-none');

  let weightKg = parseFloat(document.getElementById('weight').value) || 0;
  let heightCm = parseFloat(document.getElementById('height').value) || 0;
  
  if(document.getElementById('units').value === 'imperial') {
      weightKg = weightKg * 0.453592;
      const ft = parseFloat(document.getElementById('heightFt').value) || 0;
      const inc = parseFloat(document.getElementById('heightIn').value) || 0;
      heightCm = ((ft * 12) + inc) * 2.54;
  }
  
  const age = parseInt(document.getElementById('age').value) || 0;
  if(weightKg <= 0 || heightCm <= 0 || age <= 0) {
      errorBox.innerHTML = "<strong>Atención:</strong> Por favor ingresa correctamente tu peso, altura y edad.";
      errorBox.classList.remove('d-none');
      return;
  }

  const gender = document.getElementById('gender').value;
  const activity = parseFloat(document.getElementById('activity').value) || 1.2;
  const goal = document.getElementById('goal').value;
  const mealsCount = parseInt(document.getElementById('meals').value) || 4;
  
  let bmr = gender === 'male' 
    ? (10 * weightKg + 6.25 * heightCm - 5 * age + 5)
    : (10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    
  const bf = parseFloat(document.getElementById('bodyFat').value);
  if(!isNaN(bf) && bf > 0 && bf < 80) {
      const leanBodyMass = weightKg * (1 - (bf/100));
      bmr = 370 + (21.6 * leanBodyMass);
  }
  
  let tdee = bmr * activity;
  
  if(goal === 'deficit') tdee -= 500;
  if(goal === 'surplus') tdee += 300;
  
  const pPct = parseFloat(document.getElementById('proteinPct').value)/100 || 0;
  const fPct = parseFloat(document.getElementById('fatPct').value)/100 || 0;
  const cPct = parseFloat(document.getElementById('carbPct').value)/100 || 0;
  
  if(Math.abs((pPct+fPct+cPct)-1) > 0.01) {
      errorBox.innerHTML = "<strong>Error:</strong> Los porcentajes de macronutrientes deben sumar exactamente 100%.";
      errorBox.classList.remove('d-none');
      return;
  }
  
  const pGrams = (tdee * pPct) / 4;
  const fGrams = (tdee * fPct) / 9;
  const cGrams = (tdee * cPct) / 4;
  
  document.getElementById('summaryCards').classList.remove('d-none');
  document.getElementById('resKcal').innerText = Math.round(tdee);
  document.getElementById('resProt').innerText = Math.round(pGrams) + 'g';
  document.getElementById('resFat').innerText = Math.round(fGrams) + 'g';
  document.getElementById('resCarb').innerText = Math.round(cGrams) + 'g';
                     
  const chartCtx = document.getElementById('macroChart');
  chartCtx.classList.remove('d-none');
  if(macroChart) macroChart.destroy();
  macroChart = new Chart(chartCtx, {
      type: 'doughnut',
      data: {
          labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
          datasets: [{
              data: [pGrams, cGrams, fGrams],
              backgroundColor: ['#0A2240', '#F2A900', '#0076A8'], // Colores universitarios UDV
              borderWidth: 0
          }]
      },
      options: { plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
  });
  
  const mealsWrap = document.getElementById('mealsWrap');
  const mealsBody = document.getElementById('mealsBody');
  mealsWrap.classList.remove('d-none');
  
  let mealsHTML = '';
  for(let i=1; i<=mealsCount; i++) {
      mealsHTML += `<tr>
          <td class="fw-bold">Comida ${i}</td>
          <td>${Math.round(tdee/mealsCount)}</td>
          <td>${Math.round(pGrams/mealsCount)}g</td>
          <td>${Math.round(fGrams/mealsCount)}g</td>
          <td>${Math.round(cGrams/mealsCount)}g</td>
      </tr>`;
  }
  mealsBody.innerHTML = mealsHTML;
  
  document.getElementById('resultsZone').scrollIntoView({ behavior: 'smooth' });
}