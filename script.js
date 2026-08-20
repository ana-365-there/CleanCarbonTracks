const button = document.querySelector("button");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  message.classList.remove("hidden");
  message.textContent = "✅ Pickup booked successfully!";
  
  // Optional: reset after 3 seconds
  setTimeout(() => {
    message.classList.add("hidden");
  }, 3000);
});
// Handle showing pickup instructions
const wasteSelect = document.querySelector("select");
const instruction = document.getElementById("instruction");

wasteSelect.addEventListener("change", function() {
  const type = this.value.toLowerCase();
  instruction.classList.remove("hidden");

  switch(type) {
    case "plastic":
      instruction.textContent = "♻️ Please rinse and flatten bottles or containers before pickup.";
      break;
    case "organic":
      instruction.textContent = "🌱 Keep food waste in a sealed biodegradable bag to prevent leakage.";
      break;
    case "paper":
      instruction.textContent = "📄 Keep paper dry and separate from wet waste for easy recycling.";
      break;
    case "metal":
      instruction.textContent = "⚙️ Rinse and store cans or tins safely to avoid injury.";
      break;
    default:
      instruction.textContent = "ℹ️ Please ensure waste is properly segregated before pickup.";
  }
});
function categorizeWaste() {
  const input = document.getElementById('wasteInput').value.toLowerCase().trim();
  const result = document.getElementById('wasteResult');

  let category = '';

  if (!input) {
    result.textContent = '⚠️ Please enter an item.';
  } else if (input.includes('plastic') || input.includes('bottle')) {
    category = 'Non-biodegradable (Plastic)';
  } else if (input.includes('banana') || input.includes('food') || input.includes('leaf')) {
    category = 'Biodegradable (Organic)';
  } else if (input.includes('paper') || input.includes('box')) {
    category = 'Recyclable (Paper)';
  } else if (input.includes('metal') || input.includes('can')) {
    category = 'Recyclable (Metal)';
  } else {
    category = 'Unknown — please check local guidelines';
  }

  result.textContent = `🗑️ Category: ${category}`;
  result.classList.remove('hidden');
}

// ================================================================
// BIN REPORTING MODULE
// Handles: image preview, geolocation, form submission,
//          localStorage persistence, and report card rendering.
// All selectors use explicit IDs to avoid clashing with the
// existing querySelector("button") / querySelector("select") calls.
// ================================================================

// ------------------------------------
// State: load persisted reports from localStorage.
// NOTE: Images are stored as base64 strings. This works well for a
// prototype but localStorage has a ~5–10 MB cap. A future version
// should upload images to a server/cloud storage instead.
// ------------------------------------
let binReports = JSON.parse(localStorage.getItem('binReports')) || [];

// ------------------------------------
// IMAGE PREVIEW
// Called by onchange on the file input.
// Reads the selected file with FileReader and displays it inline
// so the user can confirm the right photo before submitting.
// ------------------------------------
function previewBinReportImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('imagePreview');
  const container = document.getElementById('imagePreviewContainer');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      container.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    // File was cleared — hide the preview
    container.classList.add('hidden');
    preview.src = '';
  }
}

// ------------------------------------
// GEOLOCATION
// Called by the "📍 Use My Location" button.
// On success: populates the location input with lat/lng coordinates.
// On failure: shows a friendly message and lets the user type manually.
// ------------------------------------
function getBinReportLocation() {
  const geoStatus = document.getElementById('geoStatus');
  const locationInput = document.getElementById('reportLocation');

  // Show the status paragraph while we wait
  geoStatus.classList.remove('hidden', 'text-green-600', 'text-red-500', 'text-gray-500');
  geoStatus.classList.add('text-gray-500');
  geoStatus.textContent = '📡 Fetching your location…';

  if (!navigator.geolocation) {
    geoStatus.textContent = '⚠️ Geolocation is not supported by this browser. Please enter your location manually.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    // Success callback
    function (position) {
      const lat = position.coords.latitude.toFixed(5);
      const lng = position.coords.longitude.toFixed(5);
      locationInput.value = 'Lat: ' + lat + ', Lng: ' + lng;
      geoStatus.classList.remove('text-gray-500');
      geoStatus.classList.add('text-green-600');
      geoStatus.textContent = '✅ Location captured successfully!';
    },
    // Error callback — covers all three GeolocationPositionError codes
    function (error) {
      var msg;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = '🚫 Location permission denied. Please type your address in the box above.';
          break;
        case error.POSITION_UNAVAILABLE:
          msg = '📵 Location information is unavailable. Please enter your address manually.';
          break;
        case error.TIMEOUT:
          msg = '⏱️ Location request timed out. Please try again or enter your address manually.';
          break;
        default:
          msg = '⚠️ Unable to retrieve location. Please enter your address manually.';
      }
      geoStatus.classList.remove('text-gray-500');
      geoStatus.classList.add('text-red-500');
      geoStatus.textContent = msg;
    }
  );
}

// ------------------------------------
// UNIQUE ID GENERATOR
// Format: RPT-<timestamp>-<3-digit random>
// Ensures each report can be uniquely identified.
// ------------------------------------
function generateReportId() {
  return 'RPT-' + Date.now() + '-' + Math.floor(Math.random() * 900 + 100);
}

// ------------------------------------
// FORM RESET
// Clears all Bin Reporting fields after a successful submission.
// ------------------------------------
function resetBinReportForm() {
  document.getElementById('issueType').value = '';
  document.getElementById('reportDesc').value = '';
  document.getElementById('reportLocation').value = '';
  document.getElementById('reportImage').value = '';     // clear file input
  document.getElementById('imagePreview').src = '';
  document.getElementById('imagePreviewContainer').classList.add('hidden');
  document.getElementById('geoStatus').classList.add('hidden');
  document.getElementById('geoStatus').textContent = '';
}

// ------------------------------------
// SUBMIT REPORT
// 1. Validates required fields (issueType, location).
// 2. Converts the selected image to a base64 string (if any).
// 3. Builds a report object and prepends it to binReports[].
// 4. Persists the array to localStorage.
// 5. Re-renders the report list.
// 6. Resets the form and shows a brief success message.
// ------------------------------------
function submitBinReport() {
  const issueType    = document.getElementById('issueType').value;
  const description  = document.getElementById('reportDesc').value.trim();
  const location     = document.getElementById('reportLocation').value.trim();
  const imageInput   = document.getElementById('reportImage');
  const errorEl      = document.getElementById('reportError');
  const successEl    = document.getElementById('reportSuccess');

  // Reset any previous feedback messages
  errorEl.classList.add('hidden');
  errorEl.textContent = '';
  successEl.classList.add('hidden');

  // --- Validation ---
  if (!issueType) {
    errorEl.textContent = '⚠️ Please select an issue type before submitting.';
    errorEl.classList.remove('hidden');
    return;
  }
  if (!location) {
    errorEl.textContent = '⚠️ Please provide a location (use the button or type an address).';
    errorEl.classList.remove('hidden');
    return;
  }

  // Inner function that finalises the report once image data is ready
  function saveReport(imageData) {
    var report = {
      id:          generateReportId(),
      issueType:   issueType,
      description: description,
      location:    location,
      image:       imageData || null,   // null when no image is selected
      status:      'Reported',
      timestamp:   new Date().toISOString()
    };

    // Prepend so newest report appears first
    binReports.unshift(report);

    // Persist to localStorage
    localStorage.setItem('binReports', JSON.stringify(binReports));

    // Refresh the displayed list
    renderBinReports();

    // Clean the form
    resetBinReportForm();

    // Show success toast, then hide after 3 seconds
    successEl.classList.remove('hidden');
    setTimeout(function () {
      successEl.classList.add('hidden');
    }, 3000);
  }

  // If an image was selected, read it as base64 first; otherwise save immediately
  var file = imageInput.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      saveReport(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    saveReport(null);
  }
}

// ------------------------------------
// RENDER REPORTS
// Reads binReports[] and builds a card for each entry inside #reportsList.
// Called on page load (to restore persisted reports) and after each submission.
// ------------------------------------
function renderBinReports() {
  var list    = document.getElementById('reportsList');
  var noMsg   = document.getElementById('noReportsMsg');

  // Clear existing cards before re-rendering
  list.innerHTML = '';

  if (binReports.length === 0) {
    noMsg.classList.remove('hidden');
    return;
  }

  noMsg.classList.add('hidden');

  binReports.forEach(function (report) {
    // Format timestamp for Indian locale (DD Mon YYYY, HH:MM)
    var date = new Date(report.timestamp).toLocaleString('en-IN', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit'
    });

    // Choose badge class based on report status
    var badgeClass = report.status === 'Resolved'
      ? 'status-resolved'
      : 'status-reported';

    // Build the image element or a placeholder when no image was uploaded
    var imageHTML = report.image
      ? '<img src="' + report.image + '" alt="Report photo" ' +
        'class="w-24 h-24 object-cover rounded-xl border border-green-200 flex-shrink-0">'
      : '<div class="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center ' +
        'flex-shrink-0 text-3xl text-gray-400">🗑️</div>';

    // Build optional description line
    var descHTML = report.description
      ? '<p class="text-sm text-gray-700 mt-2 italic">&ldquo;' + report.description + '&rdquo;</p>'
      : '';

    // Assemble the card
    var card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-md p-4 flex gap-4 items-start';
    card.innerHTML =
      imageHTML +
      '<div class="flex-1 min-w-0">' +
        '<div class="flex items-center justify-between flex-wrap gap-2 mb-1">' +
          '<span class="font-bold text-green-700 text-lg">' + report.issueType + '</span>' +
          '<span class="text-xs px-3 py-1 rounded-full font-semibold ' + badgeClass + '">' +
            report.status +
          '</span>' +
        '</div>' +
        '<p class="text-sm text-gray-500 mb-1">📍 ' + report.location + '</p>' +
        '<p class="text-sm text-gray-500 mb-1">🕒 ' + date + '</p>' +
        descHTML +
        '<p class="text-xs text-gray-400 mt-2">ID: ' + report.id + '</p>' +
      '</div>';

    list.appendChild(card);
  });
}

// ------------------------------------
// INITIAL RENDER
// Restore any reports saved in localStorage when the page first loads.
// No DOMContentLoaded wrapper needed — this script tag is already at
// the very bottom of <body>, so the DOM is fully parsed at this point.
// ------------------------------------
renderBinReports();
