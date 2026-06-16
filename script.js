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
  
  // Distribución fija y equilibrada automatizada (30% Proteína, 25% Grasas, 45% Carbohidratos)
  const pPct = 0.30;
  const fPct = 0.25;
  const cPct = 0.45;
  
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
              backgroundColor: ['#031A10', '#8AD400', '#0C3E26'], 
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

// Diccionario de Internacionalización (i18n)
const I18N = {
  en: {
    siteTitle: 'Mini Supermarket',
    siteSubtitle: 'Select your healthy ingredients - Gourmet Nutrition NY',
    navProteins: 'Proteins', navCarbs: 'Carbohydrates', navFats: 'Fats',
    navProduce: 'Fruits & Vegetables', navList: '🛒 Shopping List',
    addToList: 'Add to List', shoppingListTitle: 'Your Shopping List',
    printButton: '🖨️ Print List', clearButton: '🗑️ Clear List',
    emptyList: '(Your list is empty)', printWinTitle: 'Print Shopping List',
    printHealthyTitle: 'Your Healthy Shopping List',
    contactLine: 'Created by Luis Fernando – Certified Nutrition Coach',
    disclaimer: 'These are general nutrition suggestions for educational purposes and not medical advice. Consult your physician before major changes.',
    
    // Intros
    proteinIntroTitle: '🥩 What is Protein?',
    proteinIntroP1: "Let me break it down for you. Protein is the brick and mortar of your body. It builds your muscles, skin, nails—your strength.",
    proteinIntroP2: "It's not just that powder guys at the gym drink to get jacked. Protein is in everything from chicken and fish to eggs and even beans.",
    proteinIntroP3: "Protein keeps you full. If you're constantly hungry, chances are you're not eating enough protein.",
    proteinIntroP4: "Want to feel strong, satisfied, and take care of your body? Start by adding more protein to your plate. Every. Single. Day.",
    
    carbIntroTitle: '🍞 What are Carbohydrates?',
    carbIntroP1: "Carbs are your body's main source of energy. They're not the enemy — they power your brain and workouts.",
    carbIntroP2: "Think of carbs as fuel. Just choose the right ones like whole grains, fruits, and veggies — not the ultra-processed junk.",
    carbIntroP3: "Balance is key. You don't need to fear carbs; you just need to respect their quality and quantity.",
    
    fatIntroTitle: '🥑 What are Healthy Fats?',
    fatIntroP1: "Fats get a bad rap, but your body needs them. The key is choosing the right kind — the ones that fuel your brain and fight inflammation.",
    fatIntroP2: "Think of fats as your long-lasting energy source. They're in foods like avocado, nuts, seeds, olive oil, and fatty fish.",
    fatIntroP3: "Just watch your portions. Fat is dense in calories, but super valuable in a balanced diet.",
    
    fruitsIntroTitle: '🍎 Fruits & Vegetables',
    fruitsIntroP1: "These are nature's multivitamins. Packed with vitamins, minerals, antioxidants, and fiber that your body craves.",
    fruitsIntroP2: "Eat the rainbow — different colors mean different nutrients. The more colorful your plate, the more nutrition you're getting.",
    fruitsIntroP3: "Fresh, frozen, or dried (without added sugar) — they all count. Just aim for variety and enjoy nature's candy!",
    
    // Items
    itemChickenTitle: 'Chicken Breast', itemChickenDesc: 'Lean, versatile and packed with protein — great for meal prep and low-fat diets.',
    itemGroundTurkeyTitle: 'Ground Turkey', itemGroundTurkeyDesc: 'Lower in fat than beef, high in protein. Ideal for tacos, bowls, and more.',
    itemSirloinSteakTitle: 'Sirloin Steak', itemSirloinSteakDesc: 'High-quality red meat with excellent iron and protein content. Enjoy grilled or pan-seared.',
    itemLeanPorkChopsTitle: 'Lean Pork Chops', itemLeanPorkChopsDesc: 'Great source of protein and zinc. Choose grilled or baked for a healthy meal.',
    itemEggsTitle: 'Eggs', itemEggsDesc: 'Affordable and versatile complete protein source. Great for breakfast or snacks.',
    itemCannedTunaTitle: 'Canned Tuna', itemCannedTunaDesc: 'Convenient and shelf-stable. High in protein and ideal for quick meals or salads.',
    itemSalmonFilletTitle: 'Salmon Fillet', itemSalmonFilletDesc: 'Rich in omega-3 fats and high-quality protein. Excellent for heart and brain health.',
    itemProteinPowderTitle: 'Protein Powder', itemProteinPowderDesc: 'Quick protein option post-workout or in smoothies. Choose clean-label options.',
    itemGroundBeefTitle: 'Ground Beef (90% Lean)', itemGroundBeefDesc: 'Great source of iron and protein. Ideal for meatballs, tacos, or bowls.',
    itemTofuTitle: 'Tofu', itemTofuDesc: 'Plant-based protein made from soybeans. Great in stir-fries, soups, or grilled.',
    itemLentilsTitle: 'Lentils', itemLentilsDesc: 'High in fiber and plant-based protein. Ideal for soups, salads, and veggie burgers.',
    itemGreekYogurtTitle: 'Greek Yogurt', itemGreekYogurtDesc: 'Thick, creamy and rich in protein. Great for breakfast, snacks or smoothies.',
    itemQuinoaTitle: 'Quinoa', itemQuinoaDesc: 'Complete protein grain with all essential amino acids. Fluffy texture, perfect for bowls and salads.',
    itemBrownRiceTitle: 'Brown Rice', itemBrownRiceDesc: 'Whole grain rice rich in fiber and B vitamins. Great base for stir-fries and meal prep.',
    itemOatsTitle: 'Steel-Cut Oats', itemOatsDesc: 'Heart-healthy whole grain that keeps you full. Perfect for breakfast or overnight oats.',
    itemSweetPotatoTitle: 'Sweet Potatoes', itemSweetPotatoDesc: 'Nutrient-dense root vegetable packed with vitamin A and fiber. Great roasted or mashed.',
    itemWholeBreadTitle: 'Whole Grain Bread', itemWholeBreadDesc: 'Look for 100% whole grain with minimal ingredients. Great for toast and sandwiches.',
    itemBuckwheatTitle: 'Buckwheat', itemBuckwheatDesc: 'Gluten-free pseudo-grain with earthy flavor. High in protein and minerals.',
    itemBarleyTitle: 'Pearl Barley', itemBarleyDesc: 'Chewy grain high in soluble fiber. Perfect for soups, stews, and grain bowls.',
    itemWholePastaTitle: 'Whole Wheat Pasta', itemWholePastaDesc: 'Higher in fiber than regular pasta. Pair with vegetables and lean protein.',
    itemBananasTitle: 'Bananas', itemBananasDesc: 'Natural energy source with potassium. Perfect pre or post-workout snack.',
    itemBerriesTitle: 'Mixed Berries', itemBerriesDesc: 'Antioxidant powerhouses with natural sweetness. Great for smoothies and yogurt.',
    itemAvocadoTitle: 'Avocados', itemAvocadoDesc: 'Creamy fruit rich in monounsaturated fats. Perfect for toast, salads, and guacamole.',
    itemOliveOilTitle: 'Extra Virgin Olive Oil', itemOliveOilDesc: 'Heart-healthy cooking oil with antioxidants. Great for cooking and dressings.',
    itemAlmondsTitle: 'Raw Almonds', itemAlmondsDesc: 'Protein-rich nuts with vitamin E. Perfect snack or salad topping.',
    itemWalnutsTitle: 'Walnuts', itemWalnutsDesc: 'Brain-healthy nuts rich in omega-3s. Great in oatmeal or as a snack.',
    itemChiaSeedsTitle: 'Chia Seeds', itemChiaSeedsDesc: 'Tiny seeds packed with omega-3s and fiber. Perfect for puddings and smoothies.',
    itemFlaxSeedsTitle: 'Ground Flax Seeds', itemFlaxSeedsDesc: 'Omega-3 rich seeds best absorbed when ground. Add to smoothies or yogurt.',
    itemNutButterTitle: 'Natural Almond Butter', itemNutButterDesc: 'Pure ground almonds with no added sugar. Great on apples or toast.',
    itemCoconutOilTitle: 'Coconut Oil', itemCoconutOilDesc: 'Stable cooking oil with medium-chain fats. Good for high-heat cooking.',
    itemSesameOilTitle: 'Sesame Oil', itemSesameOilDesc: 'Flavorful oil perfect for Asian dishes. A little goes a long way.',
    itemOlivesTitle: 'Olives', itemOlivesDesc: 'Mediterranean staple rich in healthy fats. Great for snacking or cooking.',
    itemSpinachTitle: 'Fresh Spinach', itemSpinachDesc: 'Iron-rich leafy green packed with folate. Perfect for salads, smoothies, and sautéing.',
    itemKaleTitle: 'Kale', itemKaleDesc: 'Superfood green loaded with vitamins A, C, and K. Great massaged in salads or baked as chips.',
    itemBroccoliTitle: 'Broccoli', itemBroccoliDesc: 'Cruciferous vegetable high in vitamin C and fiber. Delicious steamed, roasted, or stir-fried.',
    itemBellPeppersTitle: 'Bell Peppers', itemBellPeppersDesc: 'Colorful vegetables loaded with vitamin C. Crunchy and sweet, perfect raw or cooked.',
    itemCarrotsTitle: 'Carrots', itemCarrotsDesc: 'Orange vegetables rich in beta-carotene for eye health. Great raw, roasted, or in soups.',
    itemTomatoesTitle: 'Tomatoes', itemTomatoesDesc: 'Lycopene-rich fruit great fresh or cooked. Perfect in sauces and salads.',
    itemCucumberTitle: 'Cucumbers', itemCucumberDesc: 'Hydrating and refreshing vegetable. Great for salads, snacking, or infused water.',
    itemApplesTitle: 'Apples', itemApplesDesc: 'Crunchy fruits high in fiber. Perfect snack with nut butter or in salads.',
    itemBlueberriesTitle: 'Blueberries', itemBlueberriesDesc: 'Antioxidant superstars that support brain health. Great fresh, frozen, or in smoothies.',
    itemOrangesTitle: 'Oranges', itemOrangesDesc: 'Vitamin C powerhouses. Perfect for snacking or fresh juice.',
    itemMushroomsTitle: 'Mushrooms', itemMushroomsDesc: 'Umami-rich fungi packed with B vitamins. Great sautéed, grilled, or in soups.',
    itemZucchiniTitle: 'Zucchini', itemZucchiniDesc: 'Versatile summer squash low in calories. Perfect spiralized as noodles or grilled.',
  },
  es: {
    siteTitle: 'Mini Supermercado',
    siteSubtitle: 'Selecciona tus ingredientes saludables - Gourmet Nutrition NY',
    navProteins: 'Proteínas', navCarbs: 'Carbohidratos', navFats: 'Grasas',
    navProduce: 'Frutas y Verduras', navList: '🛒 Lista de Compras',
    addToList: 'Agregar a la lista', shoppingListTitle: 'Tu lista de compras',
    printButton: '🖨️ Imprimir lista', clearButton: '🗑️ Limpiar lista',
    emptyList: '(Tu lista está vacía)', printWinTitle: 'Imprimir lista',
    printHealthyTitle: 'Tu lista de compras saludable',
    contactLine: 'Creado por Luis Fernando – Coach de Nutrición Certificado',
    disclaimer: 'Estas son sugerencias generales con fines educativos y no sustituyen consejo médico. Consulta a tu médico antes de cambios importantes.',
    
    proteinIntroTitle: '🥩 ¿Qué es la proteína?',
    proteinIntroP1: 'Te lo explico fácil: la proteína es el ladrillo y cemento de tu cuerpo. Construye tus músculos, piel y uñas: tu fortaleza.',
    proteinIntroP2: 'No es solo el polvo del gimnasio. Hay proteína en pollo, pescado, huevos y hasta frijoles.',
    proteinIntroP3: 'La proteína te mantiene satisfecho. Si tienes hambre todo el tiempo, quizá no estás comiendo suficiente.',
    proteinIntroP4: '¿Quieres sentirte fuerte y satisfecho? Empieza agregando más proteína a tu plato. Todos. Los. Días.',
    
    carbIntroTitle: '🍞 ¿Qué son los carbohidratos?',
    carbIntroP1: 'Son tu principal fuente de energía. No son el enemigo: alimentan tu cerebro y tus entrenos.',
    carbIntroP2: 'Piénsalos como combustible. Elige granos enteros, frutas y verduras; evita lo ultraprocesado.',
    carbIntroP3: 'La clave es el balance: calidad y cantidad.',
    
    fatIntroTitle: '🥑 ¿Qué son las grasas saludables?',
    fatIntroP1: 'Las grasas tienen mala fama, pero las necesitas. Elige las que nutren el cerebro y combaten la inflamación.',
    fatIntroP2: 'Son energía de larga duración: aguacate, frutos secos, semillas, aceite de oliva, pescados grasos.',
    fatIntroP3: 'Cuida las porciones. Son calóricas, pero valiosas.',
    
    fruitsIntroTitle: '🍎 Frutas y Verduras',
    fruitsIntroP1: 'Son los multivitamínicos de la naturaleza: vitaminas, minerales, antioxidantes y fibra.',
    fruitsIntroP2: 'Come el arcoíris: más colores, más nutrientes.',
    fruitsIntroP3: 'Frescas, congeladas o deshidratadas sin azúcar añadida: todas cuentan.',
    
    // Items
    itemChickenTitle: 'Pechuga de pollo', itemChickenDesc: 'Magra, versátil y cargada de proteína; ideal para meal prep.',
    itemGroundTurkeyTitle: 'Pavo molido', itemGroundTurkeyDesc: 'Menos grasa que la res y alto en proteína. Perfecto para tacos y bowls.',
    itemSirloinSteakTitle: 'Bife de lomo (sirloin)', itemSirloinSteakDesc: 'Carne roja de calidad con hierro y proteína.',
    itemLeanPorkChopsTitle: 'Chuletas de cerdo magras', itemLeanPorkChopsDesc: 'Fuente de proteína y zinc. A la parrilla u horno.',
    itemEggsTitle: 'Huevos', itemEggsDesc: 'Proteína completa, económica y versátil.',
    itemCannedTunaTitle: 'Atún en lata', itemCannedTunaDesc: 'Práctico, alto en proteína y estable en despensa.',
    itemSalmonFilletTitle: 'Filete de salmón', itemSalmonFilletDesc: 'Rico en omega-3 y proteína de alta calidad.',
    itemProteinPowderTitle: 'Proteína en polvo', itemProteinPowderDesc: 'Opción rápida post-entreno o en batidos.',
    itemGroundBeefTitle: 'Carne molida (90% magra)', itemGroundBeefDesc: 'Fuente de hierro y proteína para albóndigas o tacos.',
    itemTofuTitle: 'Tofu', itemTofuDesc: 'Proteína vegetal de soya. En salteados, sopas o a la parrilla.',
    itemLentilsTitle: 'Lentejas', itemLentilsDesc: 'Altas en fibra y proteína vegetal.',
    itemGreekYogurtTitle: 'Yogur griego', itemGreekYogurtDesc: 'Espeso, cremoso y rico en proteína.',
    itemQuinoaTitle: 'Quinua', itemQuinoaDesc: 'Grano con proteína completa. Ideal para bowls y ensaladas.',
    itemBrownRiceTitle: 'Arroz integral', itemBrownRiceDesc: 'Grano entero con fibra y vitaminas B.',
    itemOatsTitle: 'Avena (steel-cut)', itemOatsDesc: 'Grano entero cardioprotector y saciante.',
    itemSweetPotatoTitle: 'Batata (camote)', itemSweetPotatoDesc: 'Rica en vitamina A y fibra. Al horno o en puré.',
    itemWholeBreadTitle: 'Pan integral 100%', itemWholeBreadDesc: 'Pocos ingredientes, ideal para tostadas y sándwiches.',
    itemBuckwheatTitle: 'Trigo sarraceno', itemBuckwheatDesc: 'Seudocereal sin gluten, alto en minerales.',
    itemBarleyTitle: 'Cebada perlada', itemBarleyDesc: 'Fibra soluble; perfecta en sopas y guisos.',
    itemWholePastaTitle: 'Pasta integral', itemWholePastaDesc: 'Más fibra que la regular. Combina con verduras y proteína magra.',
    itemBananasTitle: 'Bananas', itemBananasDesc: 'Energía natural con potasio. Snack pre/post entreno.',
    itemBerriesTitle: 'Frutos rojos mixtos', itemBerriesDesc: 'Antioxidantes con dulzor natural.',
    itemAvocadoTitle: 'Aguacates', itemAvocadoDesc: 'Grasa monoinsaturada cremosa. Para tostadas, ensaladas y guacamole.',
    itemOliveOilTitle: 'Aceite de oliva extra virgen', itemOliveOilDesc: 'Antioxidantes; ideal en aderezos y cocción suave.',
    itemAlmondsTitle: 'Almendras crudas', itemAlmondsDesc: 'Ricas en vitamina E y proteína.',
    itemWalnutsTitle: 'Nueces', itemWalnutsDesc: 'Ricas en omega-3; para avena o snack.',
    itemChiaSeedsTitle: 'Semillas de chía', itemChiaSeedsDesc: 'Omega-3 y fibra. Para pudines y smoothies.',
    itemFlaxSeedsTitle: 'Linaza molida', itemFlaxSeedsDesc: 'Mejor absorción molida. Añade a yogur o batidos.',
    itemNutButterTitle: 'Mantequilla de almendra natural', itemNutButterDesc: 'Solo almendras; sin azúcar añadida.',
    itemCoconutOilTitle: 'Aceite de coco', itemCoconutOilDesc: 'Estable a calor medio-alto.',
    itemSesameOilTitle: 'Aceite de sésamo', itemSesameOilDesc: 'Sabor intenso; úsalo en salteados.',
    itemOlivesTitle: 'Aceitunas', itemOlivesDesc: 'Clásico mediterráneo rico en grasas saludables.',
    itemSpinachTitle: 'Espinaca fresca', itemSpinachDesc: 'Verde rico en hierro y folato.',
    itemKaleTitle: 'Kale (col rizada)', itemKaleDesc: 'Cargado de vitaminas A, C y K.',
    itemBroccoliTitle: 'Brócoli', itemBroccoliDesc: 'Alto en vitamina C y fibra.',
    itemBellPeppersTitle: 'Pimientos morrones', itemBellPeppersDesc: 'Crujientes, dulces y ricos en vitamina C.',
    itemCarrotsTitle: 'Zanahorias', itemCarrotsDesc: 'Ricas en betacaroteno para la vista.',
    itemTomatoesTitle: 'Tomates', itemTomatoesDesc: 'Ricos en licopeno; frescos o cocidos.',
    itemCucumberTitle: 'Pepinos', itemCucumberDesc: 'Hidratantes y refrescantes.',
    itemApplesTitle: 'Manzanas', itemApplesDesc: 'Fibra crujiente; gran snack.',
    itemBlueberriesTitle: 'Arándanos', itemBlueberriesDesc: 'Antioxidantes para el cerebro.',
    itemOrangesTitle: 'Naranjas', itemOrangesDesc: 'Vitamina C para tus defensas.',
    itemMushroomsTitle: 'Hongos (setas)', itemMushroomsDesc: 'Ricos en vitaminas del complejo B.',
    itemZucchiniTitle: 'Calabacín (zucchini)', itemZucchiniDesc: 'Versátil y bajo en calorías.',
  },
  pt: {
    siteTitle: 'Mini Supermercado',
    siteSubtitle: 'Selecione seus ingredientes saudáveis - Gourmet Nutrition NY',
    navProteins: 'Proteínas', navCarbs: 'Carboidratos', navFats: 'Gorduras',
    navProduce: 'Frutas e Vegetais', navList: '🛒 Lista de Compras',
    addToList: 'Adicionar à lista', shoppingListTitle: 'Sua lista de compras',
    printButton: '🖨️ Imprimir lista', clearButton: '🗑️ Limpar lista',
    emptyList: '(Sua lista está vazia)', printWinTitle: 'Imprimir lista',
    printHealthyTitle: 'Sua lista de compras saudável',
    contactLine: 'Criado por Luis Fernando – Coach de Nutrição Certificado',
    disclaimer: 'Sugestões gerais para educação; não substituem aconselhamento médico. Consulte seu médico antes de mudanças importantes.',
    
    proteinIntroTitle: '🥩 O que é proteína?',
    proteinIntroP1: 'Proteína é o tijolo e a argamassa do seu corpo. Constrói músculos, pele e unhas.',
    proteinIntroP2: 'Não é só o pó da academia. Há proteína em frango, peixe, ovos e até feijões.',
    proteinIntroP3: 'Proteína dá saciedade. Se sente fome sempre, talvez esteja comendo pouca proteína.',
    proteinIntroP4: 'Quer se sentir forte e satisfeito? Coloque mais proteína no prato. Todos. Os. Dias.',
    
    carbIntroTitle: '🍞 O que são carboidratos?',
    carbIntroP1: 'Sua principal fonte de energia. Não são inimigos: movem seu cérebro e treinos.',
    carbIntroP2: 'Pense como combustível. Prefira integrais, frutas e vegetais; evite ultraprocessados.',
    carbIntroP3: 'Equilíbrio é tudo: qualidade e quantidade.',
    
    fatIntroTitle: '🥑 O que são gorduras saudáveis?',
    fatIntroP1: 'Gorduras têm má fama, mas você precisa delas. Escolha as que nutrem o cérebro e reduzem inflamação.',
    fatIntroP2: 'Energia de longa duração: abacate, nozes, sementes, azeite e peixes gordos.',
    fatIntroP3: 'Atenção às porções: densas em calorias.',
    
    fruitsIntroTitle: '🍎 Frutas e Vegetais',
    fruitsIntroP1: 'São os multivitamínicos da natureza: vitaminas, minerais, antioxidantes e fibra.',
    fruitsIntroP2: 'Coma o arco-íris: mais cores, mais nutrientes.',
    fruitsIntroP3: 'Frescos, congelados ou secos sem açúcar — todos contam.',
    
    // Items
    itemChickenTitle: 'Peito de frango', itemChickenDesc: 'Magra, versátil e rica em proteína; ótima para marmitas.',
    itemGroundTurkeyTitle: 'Peru moído', itemGroundTurkeyDesc: 'Menos gordura que boi, alto em proteína.',
    itemSirloinSteakTitle: 'Bife de alcatra (sirloin)', itemSirloinSteakDesc: 'Carne vermelha de qualidade com ferro e proteína.',
    itemLeanPorkChopsTitle: 'Bistecas de porco magras', itemLeanPorkChopsDesc: 'Fonte de proteína e zinco.',
    itemEggsTitle: 'Ovos', itemEggsDesc: 'Proteína completa, barata e versátil.',
    itemCannedTunaTitle: 'Atum em lata', itemCannedTunaDesc: 'Prático, rico em proteína e estável na despensa.',
    itemSalmonFilletTitle: 'Filete de salmão', itemSalmonFilletDesc: 'Rico em ômega-3 e proteína de alta qualidade.',
    itemProteinPowderTitle: 'Proteína em pó', itemProteinPowderDesc: 'Opção rápida pós-treino ou em smoothies.',
    itemGroundBeefTitle: 'Carne moída (90% magra)', itemGroundBeefDesc: 'Ferro e proteína para almôndegas ou tacos.',
    itemTofuTitle: 'Tofu', itemTofuDesc: 'Proteína vegetal de soja.',
    itemLentilsTitle: 'Lentilhas', itemLentilsDesc: 'Ricas em fibra e proteína vegetal.',
    itemGreekYogurtTitle: 'Iogurte grego', itemGreekYogurtDesc: 'Espesso, cremoso e rico em preço.',
    itemQuinoaTitle: 'Quinoa', itemQuinoaDesc: 'Grão com proteína completa; fofo, ótimo em bowls e saladas.',
    itemBrownRiceTitle: 'Arroz integral', itemBrownRiceDesc: 'Grão inteiro com fibra e vitaminas do complexo B.',
    itemOatsTitle: 'Aveia (steel-cut)', itemOatsDesc: 'Grão inteiro que sacia; perfeito no café da manhã.',
    itemSweetPotatoTitle: 'Batata-doce', itemSweetPotatoDesc: 'Vitamina A e fibra; assada ou em purê.',
    itemWholeBreadTitle: 'Pão integral 100%', itemWholeBreadDesc: 'Poucos ingredientes; para torradas e sanduíches.',
    itemBuckwheatTitle: 'Trigo sarraceno', itemBuckwheatDesc: 'Pseudocereal sem glúten, rico em minerais.',
    itemBarleyTitle: 'Cevada perlada', itemBarleyDesc: 'Alta em fibra solúvel; vai bem em sopas.',
    itemWholePastaTitle: 'Massa integral', itemWholePastaDesc: 'Massa com mais fibra; combine com legumes e proteína.',
    itemBananasTitle: 'Bananas', itemBananasDesc: 'Energia natural com potássio.',
    itemBerriesTitle: 'Frutas vermelhas mistas', itemBerriesDesc: 'Antioxidantes com doçura natural.',
    itemAvocadoTitle: 'Abacates', itemAvocadoDesc: 'Gordura monoinsaturada cremosa; para torradas e saladas.',
    itemOliveOilTitle: 'Azeite extra virgem', itemOliveOilDesc: 'Antioxidantes; ótimo para molhos e cozimento leve.',
    itemAlmondsTitle: 'Amêndoas cruas', itemAlmondsDesc: 'Vitamina E e proteína.',
    itemWalnutsTitle: 'Nozes', itemWalnutsDesc: 'Ricas em ômega-3.',
    itemChiaSeedsTitle: 'Sementes de chia', itemChiaSeedsDesc: 'Ômega-3 e fibra.',
    itemFlaxSeedsTitle: 'Linhaça moída', itemFlaxSeedsDesc: 'Melhor absorção quando moída.',
    itemNutButterTitle: 'Pasta de amêndoa natural', itemNutButterDesc: 'Só amêndoas; sem açúcar.',
    itemCoconutOilTitle: 'Óleo de coco', itemCoconutOilDesc: 'Estável em calor alto.',
    itemSesameOilTitle: 'Óleo de gergelim', itemSesameOilDesc: 'Sabor marcante; use pouco.',
    itemOlivesTitle: 'Azeitonas', itemOlivesDesc: 'Clássico mediterrâneo.',
    itemSpinachTitle: 'Espinafre fresco', itemSpinachDesc: 'Rico em ferro e folato.',
    itemKaleTitle: 'Couve kale', itemKaleDesc: 'Vitaminas A, C e K.',
    itemBroccoliTitle: 'Brócolis', itemBroccoliDesc: 'Vitamina C e fibra.',
    itemBellPeppersTitle: 'Pimentões', itemBellPeppersDesc: 'Crocrantes e ricos em vitamina C.',
    itemCarrotsTitle: 'Cenouras', itemCarrotsDesc: 'Betacaroteno para a visão.',
    itemTomatoesTitle: 'Tomates', itemTomatoesDesc: 'Ricos em licopeno.',
    itemCucumberTitle: 'Pepinos', itemCucumberDesc: 'Hidratantes e refrescantes.',
    itemApplesTitle: 'Maçãs', itemApplesDesc: 'Fibras; ótimo lanche.',
    itemBlueberriesTitle: 'Mirtilos', itemBlueberriesDesc: 'Antioxidantes para o cérebro.',
    itemOrangesTitle: 'Laranjas', itemOrangesDesc: 'Vitamina C.',
    itemMushroomsTitle: 'Cogumelos', itemMushroomsDesc: 'Ricos em vitaminas do complexo B.',
    itemZucchiniTitle: 'Abobrinha', itemZucchiniDesc: 'Versátil e leve.',
  }
};

let currentLang = 'en';
const listItems = [];

function t(key) { 
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.en[key] || ''); 
}

// Aplica las traducciones dinámicas en base al idioma seleccionado
function applyTranslations(lang) {
  currentLang = I18N[lang] ? lang : 'en';
  document.documentElement.setAttribute('lang', currentLang);
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { 
      el.setAttribute('placeholder', val); 
    } else { 
      el.innerHTML = val; 
    }
  });

  document.querySelectorAll('.lang-switch .btn-lang').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
}

// Controla el intercambio dinámico de las secciones visibles
function showSection(id) {
  document.querySelectorAll('.market-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Actualiza el estado visual activo en los botones de categoría
  document.querySelectorAll('.category-nav .btn-category').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Mapea y activa el botón correcto según el click recibido
  const currentBtn = Array.from(document.querySelectorAll('.category-nav .btn-category')).find(b => 
    b.getAttribute('onclick').includes(`'${id}'`)
  );
  if (currentBtn) currentBtn.classList.add('active');
}

// Añadir ingrediente a la lista
function addToList(label) {
  if (!listItems.includes(label)) {
    listItems.push(label);
    updateListUI();
  }
}

// Actualiza la interfaz del bloque de compras (cuaderno)
function updateListUI() {
  const ul = document.getElementById('list');
  if (!ul) return;
  ul.innerHTML = '';
  
  if (listItems.length === 0) {
    const li = document.createElement('li');
    li.style.listStyleType = 'none';
    li.className = 'text-muted text-center italic small';
    li.textContent = t('emptyList');
    ul.appendChild(li);
    return;
  }

  listItems.forEach(i => {
    const li = document.createElement('li');
    li.textContent = i;
    ul.appendChild(li);
  });
}

// Vaciar la lista
function clearList() {
  listItems.length = 0;
  updateListUI();
}

// Función limpia para la ventana nativa de impresión optimizada
function printList() {
  const listContent = listItems.length ? listItems.map(i => `• ${i}`).join('\n') : t('emptyList');
  const w = window.open('', '_blank');
  w.document.write(`
    <html>
    <head>
      <title>${t('printWinTitle')}</title>
      <style>
        body { font-family: 'Open Sans', sans-serif; color: #031A10; padding: 3rem; line-height: 1.8; text-align: center; background-color: #FFFFFF; }
        h2 { font-family: 'Montserrat', sans-serif; color: #0C3E26; font-size: 1.6rem; border-bottom: 2px solid #8AD400; padding-bottom: 10px; }
        .box { display: inline-block; text-align: left; background: linear-gradient(#EBF7E9 1px, transparent 1px); background-size: 100% 28px; padding: 1.5rem; width: 80%; max-width: 500px; margin-top: 20px; font-weight: 600; font-size: 1.1rem; }
        pre { font-family: inherit; white-space: pre-wrap; margin: 0; }
        .disclaimer { font-size: 0.8rem; color: #556B5D; max-width: 600px; margin: 40px auto 0 auto; line-height: 1.4; border-top: 1px solid rgba(12,62,38,0.1); padding-top: 15px; }
      </style>
    </head>
    <body>
      <h2>Gourmet Nutrition NY — ${t('printHealthyTitle')}</h2>
      <div class="box"><pre>${listContent}</pre></div>
      <div class="disclaimer">
        <strong>${t('contactLine')}</strong> · 📞 973-851-3424<br/><br/>${t('disclaimer')}
      </div>
      <script>window.onload = () => { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  w.document.close();
}

// Evento Global para el Switcher de Idiomas
document.addEventListener('click', e => {
  const btn = e.target.closest('.lang-switch .btn-lang');
  if (!btn) return;
  applyTranslations(btn.dataset.lang);
  updateListUI(); // Refresca los estados vacíos
});

// Inicialización de Carga Nativa
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
  updateListUI();
});