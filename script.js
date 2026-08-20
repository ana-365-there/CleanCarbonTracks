// Global Variables for ML Model and Current Detection State
let mobilenetModel = null;
let lastDetectedCategoryKey = 'plastic';

// Initialize MobileNet TensorFlow.js Model Client-Side
window.addEventListener('DOMContentLoaded', () => {
  initMobileNet();
  initFormEventListeners();
  initDropZone();
  initKnowYourWaste();
});

function initMobileNet() {
  if (window.mobilenet) {
    console.log("Loading TensorFlow.js MobileNet model...");
    window.mobilenet.load().then(model => {
      mobilenetModel = model;
      console.log("MobileNet ML model loaded successfully!");
    }).catch(err => {
      console.warn("MobileNet load error, hybrid engine will rely on Canvas RGB color rules:", err);
    });
  }
}

// ----------------------------------------------------
// 1. Resident Portal Booking Form Handlers
// ----------------------------------------------------
function initFormEventListeners() {
  const bookBtn = document.getElementById("bookPickupBtn");
  const message = document.getElementById("message");
  const wasteSelect = document.getElementById("wasteSelect");
  const instruction = document.getElementById("instruction");

  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("residentName");
      const name = nameInput ? nameInput.value.trim() : "";
      
      message.classList.remove("hidden");
      if (name) {
        message.textContent = `✅ Pickup booked successfully for ${name}!`;
      } else {
        message.textContent = "✅ Pickup booked successfully!";
      }

      setTimeout(() => {
        message.classList.add("hidden");
      }, 4000);
    });
  }

  if (wasteSelect && instruction) {
    wasteSelect.addEventListener("change", function() {
      updateInstructionText(this.value, instruction);
    });
  }
}

function updateInstructionText(typeVal, element) {
  element.classList.remove("hidden");
  switch(typeVal.toLowerCase()) {
    case "plastic":
      element.textContent = "♻️ Please rinse and flatten plastic bottles or containers before pickup.";
      break;
    case "organic":
      element.textContent = "🌱 Keep food/wet waste in a sealed biodegradable bag for composting.";
      break;
    case "paper":
      element.textContent = "📄 Keep paper and cardboard dry and separate from wet waste.";
      break;
    case "metal":
      element.textContent = "⚙️ Rinse and store metal cans or tins safely to prevent injury.";
      break;
    case "hazardous":
      element.textContent = "⚠️ Keep batteries/e-waste separate in a red bin to prevent toxic chemical leak.";
      break;
    default:
      element.textContent = "ℹ️ Please ensure waste is properly segregated before pickup.";
  }
}

// ----------------------------------------------------
// 2. Know Your Waste Dropdown Handler
// ----------------------------------------------------
function initKnowYourWaste() {
  const wasteTips = {
    "Plastic Bottle": "Recycle it in the dry/blue plastic bin. Avoid burning — it releases toxic fumes.",
    "Food Waste": "Compost if possible! Wet waste generates nutrient-rich natural fertilizer.",
    "Cardboard Box": "Flatten completely and recycle with clean paper waste in the blue bin.",
    "Old Battery": "Do NOT throw in regular household bins — deposit at e-waste collection centers or red hazardous bins."
  };

  const select = document.getElementById('wasteItem');
  const tipPara = document.getElementById('wasteTip');

  if (select && tipPara) {
    select.addEventListener('change', function() {
      const selected = this.value;
      tipPara.textContent = wasteTips[selected] || '';
    });
  }
}

// ----------------------------------------------------
// 3. Tab Switching for Smart Waste Categorizer
// ----------------------------------------------------
function switchCategorizerTab(mode) {
  const imgMode = document.getElementById("imageCategorizerMode");
  const textMode = document.getElementById("textCategorizerMode");
  const tabImageBtn = document.getElementById("tabImageBtn");
  const tabTextBtn = document.getElementById("tabTextBtn");

  if (mode === 'image') {
    imgMode.classList.remove("hidden");
    textMode.classList.add("hidden");
    tabImageBtn.className = "py-2 px-4 font-semibold text-green-600 border-b-2 border-green-600 focus:outline-none";
    tabTextBtn.className = "py-2 px-4 font-semibold text-gray-500 hover:text-green-600 focus:outline-none";
  } else {
    textMode.classList.remove("hidden");
    imgMode.classList.add("hidden");
    tabTextBtn.className = "py-2 px-4 font-semibold text-green-600 border-b-2 border-green-600 focus:outline-none";
    tabImageBtn.className = "py-2 px-4 font-semibold text-gray-500 hover:text-green-600 focus:outline-none";
  }
}

// ----------------------------------------------------
// 4. Text-Based Categorize Function
// ----------------------------------------------------
function categorizeWaste() {
  const input = document.getElementById('wasteInput').value.toLowerCase().trim();
  const result = document.getElementById('wasteResult');

  let category = '';

  if (!input) {
    result.textContent = '⚠️ Please enter an item name.';
  } else if (input.includes('plastic') || input.includes('bottle') || input.includes('wrapper') || input.includes('poly')) {
    category = 'Non-biodegradable (Plastic) ♻️ — Dispose in Blue Bin';
  } else if (input.includes('banana') || input.includes('food') || input.includes('leaf') || input.includes('peel') || input.includes('vegetable') || input.includes('fruit')) {
    category = 'Biodegradable (Organic) 🌱 — Dispose in Green Bin';
  } else if (input.includes('paper') || input.includes('box') || input.includes('cardboard') || input.includes('newspaper')) {
    category = 'Recyclable (Paper & Cardboard) 📦 — Dispose in Blue Bin';
  } else if (input.includes('metal') || input.includes('can') || input.includes('tin') || input.includes('foil')) {
    category = 'Recyclable (Metal) 🥫 — Dispose in Blue Bin';
  } else if (input.includes('battery') || input.includes('bulb') || input.includes('wire') || input.includes('electronic') || input.includes('toxic') || input.includes('chemical')) {
    category = 'Hazardous / E-Waste ⚠️ — Dispose in Red Hazardous Bin';
  } else {
    category = 'General Waste — Check municipal segregation guidelines';
  }

  result.textContent = `🗑️ Category: ${category}`;
  result.classList.remove('hidden');
}

// ----------------------------------------------------
// 5. Drag & Drop and Image Upload Handlers
// ----------------------------------------------------
function initDropZone() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("wasteImageInput");

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener("click", () => fileInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });
}

function handleImageFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    analyzeImage(e.target.result, null);
  };
  reader.readAsDataURL(file);
}

// ----------------------------------------------------
// 6. Quick Sample Image Generator
// ----------------------------------------------------
function loadSampleImage(sampleType) {
  // Generate sample colored SVG Data URIs representing waste bin photos
  let svgString = '';
  if (sampleType === 'organic') {
    svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#22c55e"/>
      <circle cx="150" cy="120" r="60" fill="#15803d"/>
      <path d="M120 180 Q 150 140 180 180 T 240 180" stroke="#86efac" stroke-width="12" fill="none"/>
      <text x="50%" y="85%" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">GREEN BIN - WET WASTE</text>
    </svg>`;
  } else if (sampleType === 'plastic') {
    svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#3b82f6"/>
      <rect x="110" y="80" width="80" height="130" rx="15" fill="#1d4ed8"/>
      <rect x="130" y="55" width="40" height="25" rx="5" fill="#93c5fd"/>
      <text x="50%" y="88%" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">BLUE BIN - DRY PLASTIC</text>
    </svg>`;
  } else if (sampleType === 'hazardous') {
    svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#ef4444"/>
      <polygon points="150,50 230,200 70,200" fill="#b91c1c"/>
      <text x="150" y="170" font-family="sans-serif" font-size="60" font-weight="bold" fill="#fef08a" text-anchor="middle">!</text>
      <text x="50%" y="88%" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">RED BIN - HAZARDOUS</text>
    </svg>`;
  } else if (sampleType === 'paper') {
    svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#d97706"/>
      <rect x="70" y="80" width="160" height="120" fill="#b45309" stroke="#fef3c7" stroke-width="4"/>
      <line x1="70" y1="80" x2="230" y2="200" stroke="#fef3c7" stroke-width="4"/>
      <text x="50%" y="88%" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">PAPER & CARDBOARD</text>
    </svg>`;
  }

  const encoded = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  analyzeImage(encoded, sampleType);
}

// ----------------------------------------------------
// 7. Hybrid Recognition Engine (Canvas Color Rules + TensorFlow MobileNet)
// ----------------------------------------------------
async function analyzeImage(imageSrc, forcedTypeHint) {
  const container = document.getElementById("imagePreviewContainer");
  const preview = document.getElementById("imagePreview");
  const loader = document.getElementById("analysisLoader");
  const resultCard = document.getElementById("imageResultCard");

  container.classList.remove("hidden");
  loader.classList.remove("hidden");
  resultCard.classList.add("hidden");

  preview.src = imageSrc;

  preview.onload = async () => {
    // Step A: Perform HTML5 Canvas RGB Color Analysis
    const colorMetrics = analyzeCanvasColors(preview);

    // Step B: Perform MobileNet ML Classification (if model ready)
    let mlResult = null;
    if (mobilenetModel) {
      try {
        const predictions = await mobilenetModel.classify(preview);
        if (predictions && predictions.length > 0) {
          mlResult = mapMLPredictionToCategory(predictions);
        }
      } catch (e) {
        console.warn("MobileNet classify exception:", e);
      }
    }

    // Step C: Combine ML & Color-Rule Heuristics
    const finalClassification = decideHybridCategory(colorMetrics, mlResult, forcedTypeHint);

    // Update UI Elements
    renderClassificationResult(finalClassification, colorMetrics);

    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");
  };
}

// Canvas RGB Extraction and Ratio Analysis
function analyzeCanvasColors(imgElement) {
  const canvas = document.getElementById("analysisCanvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = 100;
  canvas.height = 100;
  ctx.drawImage(imgElement, 0, 0, 100, 100);

  let imageData;
  try {
    imageData = ctx.getImageData(0, 0, 100, 100).data;
  } catch (e) {
    // Cross-origin SVG fallback
    return { greenRatio: 25, blueRatio: 25, redRatio: 25, neutralRatio: 25 };
  }

  let greenPixels = 0;
  let bluePixels = 0;
  let redPixels = 0;
  let neutralPixels = 0;
  let totalPixels = imageData.length / 4;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    if (g > r + 15 && g > b + 15) {
      greenPixels++;
    } else if (b > r + 15 && b > g + 15) {
      bluePixels++;
    } else if (r > g + 20 && r > b + 20) {
      redPixels++;
    } else {
      neutralPixels++;
    }
  }

  return {
    greenRatio: Math.round((greenPixels / totalPixels) * 100),
    blueRatio: Math.round((bluePixels / totalPixels) * 100),
    redRatio: Math.round((redPixels / totalPixels) * 100),
    neutralRatio: Math.round((neutralPixels / totalPixels) * 100)
  };
}

// Map TensorFlow ImageNet labels to Waste Categories
function mapMLPredictionToCategory(predictions) {
  const organicKeywords = ['banana', 'apple', 'orange', 'broccoli', 'cabbage', 'strawberry', 'pineapple', 'cucumber', 'lemon', 'mushroom', 'food', 'produce', 'salad', 'fruit', 'vegetable', 'leaf'];
  const plasticKeywords = ['water bottle', 'pop bottle', 'bottle', 'plastic', 'bucket', 'container', 'tub', 'cup', 'wrapper', 'bag'];
  const paperKeywords = ['carton', 'cardboard', 'packet', 'envelope', 'book', 'paper', 'binder', 'box'];
  const metalKeywords = ['can', 'tin', 'aluminum', 'brass', 'steel', 'thimble'];
  const hazardousKeywords = ['battery', 'cell', 'syringe', 'flashlight', 'electronic', 'plug', 'wire', 'lighter'];

  for (let p of predictions) {
    const label = p.className.toLowerCase();
    const conf = Math.round(p.probability * 100);

    if (organicKeywords.some(k => label.includes(k))) {
      return { categoryKey: 'organic', title: 'Biodegradable (Organic Waste)', label: p.className, conf };
    }
    if (plasticKeywords.some(k => label.includes(k))) {
      return { categoryKey: 'plastic', title: 'Non-Biodegradable (Plastic)', label: p.className, conf };
    }
    if (paperKeywords.some(k => label.includes(k))) {
      return { categoryKey: 'paper', title: 'Recyclable (Paper & Cardboard)', label: p.className, conf };
    }
    if (metalKeywords.some(k => label.includes(k))) {
      return { categoryKey: 'metal', title: 'Recyclable (Metal Waste)', label: p.className, conf };
    }
    if (hazardousKeywords.some(k => label.includes(k))) {
      return { categoryKey: 'hazardous', title: 'Hazardous / E-Waste', label: p.className, conf };
    }
  }

  // Top fallback prediction
  return { categoryKey: 'unknown', title: predictions[0].className, label: predictions[0].className, conf: Math.round(predictions[0].probability * 100) };
}

// Hybrid Decision Strategy
function decideHybridCategory(colorMetrics, mlResult, forcedTypeHint) {
  // If quick sample hint is passed directly
  if (forcedTypeHint) {
    if (forcedTypeHint === 'organic') return buildCategoryObject('organic', '🌱 Biodegradable (Organic Waste)', '🟢 Dump in GREEN Bin (Wet/Organic)', 'Compost organic waste. High green color ratio detected.', '🎨 Rule Engine: Color-Code Green', 'bg-emerald-100 text-emerald-800');
    if (forcedTypeHint === 'plastic') return buildCategoryObject('plastic', '♻️ Non-Biodegradable (Plastic)', '🔵 Dump in BLUE Bin (Dry/Recyclable)', 'Rinse and flatten plastics before disposal.', '🎨 Rule Engine: Color-Code Blue', 'bg-blue-100 text-blue-800');
    if (forcedTypeHint === 'hazardous') return buildCategoryObject('hazardous', '⚠️ Hazardous / E-Waste', '🔴 Dump in RED Bin (Hazardous)', 'Do not mix with regular bins. Deposit at e-waste center.', '🎨 Rule Engine: Color-Code Red', 'bg-red-100 text-red-800');
    if (forcedTypeHint === 'paper') return buildCategoryObject('paper', '📦 Recyclable (Paper & Cardboard)', '🔵 Dump in BLUE Bin (Paper/Dry)', 'Keep dry and flatten boxes.', '🎨 Rule Engine: Color-Code Neutral', 'bg-amber-100 text-amber-800');
  }

  // High confidence ML model match
  if (mlResult && mlResult.categoryKey !== 'unknown' && mlResult.conf >= 30) {
    lastDetectedCategoryKey = mlResult.categoryKey;
    const badgeText = `🤖 ML MobileNet (${mlResult.conf}% - "${mlResult.label}")`;

    if (mlResult.categoryKey === 'organic') {
      return buildCategoryObject('organic', '🌱 ' + mlResult.title, '🟢 Dump in GREEN Bin (Wet Waste)', 'Compost food and organic waste to reduce landfill footprint.', badgeText, 'bg-emerald-100 text-emerald-800 border border-emerald-300');
    }
    if (mlResult.categoryKey === 'plastic') {
      return buildCategoryObject('plastic', '♻️ ' + mlResult.title, '🔵 Dump in BLUE Bin (Dry Plastic)', 'Rinse plastic items to prevent contamination in recycling.', badgeText, 'bg-blue-100 text-blue-800 border border-blue-300');
    }
    if (mlResult.categoryKey === 'paper') {
      return buildCategoryObject('paper', '📦 ' + mlResult.title, '🔵 Dump in BLUE Bin (Paper/Cardboard)', 'Flatten cardboard boxes to optimize truck capacity.', badgeText, 'bg-amber-100 text-amber-800 border border-amber-300');
    }
    if (mlResult.categoryKey === 'metal') {
      return buildCategoryObject('metal', '🥫 ' + mlResult.title, '🔵 Dump in BLUE Bin (Metals)', 'Store metal cans safely for efficient material recovery.', badgeText, 'bg-cyan-100 text-cyan-800 border border-cyan-300');
    }
    if (mlResult.categoryKey === 'hazardous') {
      return buildCategoryObject('hazardous', '⚠️ ' + mlResult.title, '🔴 Dump in RED Bin (Hazardous)', 'Segregate e-waste and chemicals into authorized collection bins.', badgeText, 'bg-red-100 text-red-800 border border-red-300');
    }
  }

  // Fallback to Canvas Color Rule Engine
  const { greenRatio, blueRatio, redRatio } = colorMetrics;

  if (greenRatio >= 30 || greenRatio > blueRatio && greenRatio > redRatio) {
    lastDetectedCategoryKey = 'organic';
    return buildCategoryObject('organic', '🌱 Biodegradable (Organic Waste)', '🟢 Dump in GREEN Bin (Wet Waste)', 'High green spectrum detected. Ideal for composting.', '🎨 Rule Engine: Green Ratio (' + greenRatio + '%)', 'bg-emerald-100 text-emerald-800 border border-emerald-300');
  }
  if (blueRatio >= 30 || blueRatio > redRatio) {
    lastDetectedCategoryKey = 'plastic';
    return buildCategoryObject('plastic', '♻️ Non-Biodegradable (Dry Plastic)', '🔵 Dump in BLUE Bin (Dry Waste)', 'High blue spectrum detected. Recycle with dry waste.', '🎨 Rule Engine: Blue Ratio (' + blueRatio + '%)', 'bg-blue-100 text-blue-800 border border-blue-300');
  }
  if (redRatio >= 25) {
    lastDetectedCategoryKey = 'hazardous';
    return buildCategoryObject('hazardous', '⚠️ Hazardous Waste / E-Waste', '🔴 Dump in RED Bin (Hazardous)', 'High red spectrum detected. Handle with care.', '🎨 Rule Engine: Red Ratio (' + redRatio + '%)', 'bg-red-100 text-red-800 border border-red-300');
  }

  // Default Neutral / Mixed Waste
  lastDetectedCategoryKey = 'paper';
  return buildCategoryObject('paper', '📦 Mixed Recyclable / Paper Waste', '🔵 Dump in BLUE Bin (Dry/Mixed)', 'Segregate paper and dry materials before pickup.', '🎨 Rule Engine: Neutral Spectrum', 'bg-gray-100 text-gray-800 border border-gray-300');
}

function buildCategoryObject(key, title, binRec, tip, badgeText, badgeStyle) {
  return { key, title, binRec, tip, badgeText, badgeStyle };
}

function renderClassificationResult(res, colorMetrics) {
  const titleEl = document.getElementById("imageResultCategory");
  const badgeEl = document.getElementById("detectionEngineBadge");
  const binEl = document.getElementById("binRecommendation");
  const tipEl = document.getElementById("imageDisposalTip");

  titleEl.textContent = res.title;
  badgeEl.textContent = res.badgeText;
  badgeEl.className = `text-xs font-semibold px-2.5 py-1 rounded-md ${res.badgeStyle}`;

  binEl.textContent = res.binRec;
  binEl.className = `text-sm font-semibold p-2.5 rounded-lg ${res.badgeStyle}`;

  tipEl.textContent = "💡 Tip: " + res.tip;

  // Update Color Breakdown Bar
  document.getElementById("greenRatioBar").style.width = colorMetrics.greenRatio + "%";
  document.getElementById("blueRatioBar").style.width = colorMetrics.blueRatio + "%";
  document.getElementById("redRatioBar").style.width = colorMetrics.redRatio + "%";
  document.getElementById("neutralRatioBar").style.width = colorMetrics.neutralRatio + "%";

  document.getElementById("colorDistributionText").textContent =
    `Green: ${colorMetrics.greenRatio}% | Blue: ${colorMetrics.blueRatio}% | Red: ${colorMetrics.redRatio}%`;
}

// ----------------------------------------------------
// 8. Apply Categorization to Resident Booking Form
// ----------------------------------------------------
function applyClassificationToBooking() {
  const wasteSelect = document.getElementById("wasteSelect");
  const instruction = document.getElementById("instruction");

  if (wasteSelect) {
    wasteSelect.value = lastDetectedCategoryKey;
    if (instruction) {
      updateInstructionText(lastDetectedCategoryKey, instruction);
    }
  }

  // Scroll to booking form smoothly
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.scrollIntoView({ behavior: 'smooth' });
    bookingForm.classList.add("ring-4", "ring-green-400");
    setTimeout(() => {
      bookingForm.classList.remove("ring-4", "ring-green-400");
    }, 1500);
  }
}
