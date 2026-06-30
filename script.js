const tableContainer = document.getElementById('periodic-table');
const panel = document.getElementById('side-panel');
const elName = document.getElementById('name');
const elDetails = document.getElementById('details');
const closeBtn = document.getElementById('close-btn');
const searchBar = document.getElementById('search-bar');

closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
});

//theme toggle
const toggleSwitch = document.querySelector('#checkbox');
const themeLabel = document.querySelector('.theme-label');

toggleSwitch.addEventListener('change', (e) => {
    console.log("button click");
    if (e.target.checked) {
        document.body.classList.add('light-mode');
        themeLabel.innerText = "Light Mode";
    } else {
        document.body.classList.remove('light-mode');
        themeLabel.innerText = "Dark Mode";
    }
});

// Search Bar Logic

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.element-card');

    cards.forEach(card => {
        // Card ke data attributes se value nikalna
        const name = card.getAttribute('data-name');
        const symbol = card.getAttribute('data-symbol');
        const number = card.getAttribute('data-number');
        
        // Match checking logic
        if (name.includes(searchTerm) || symbol.includes(searchTerm) || number === searchTerm ){
            card.style.display = "flex"; // Match hone par dikhao
        } else {
            card.style.display = "none"; // Match na hone par hide karo
        }
    });
});


fetch('data1.json') 
.then(response => response.json())
.then(data => {
    const elements = data.elements || data; 

   elements.forEach(element => {
    const card = document.createElement('div');
    card.classList.add('element-card');
  
    card.setAttribute('data-name', element.name.toLowerCase());
    card.setAttribute('data-symbol', element.symbol.toLowerCase());
    card.setAttribute('data-name', element.name.toLowerCase());
    card.setAttribute('data-symbol', element.symbol.toLowerCase());
    card.setAttribute('data-number', element.number);

    // Grid Positions
    card.style.gridColumn = element.xpos;
    card.style.gridRow = element.ypos;

    
 // --- CORRECTED COLOR FIX LOGIC ---
let cat = (element.category || "unknown").toLowerCase();
let categoryClass = "category-unknown"; // Default


if (cat === "post-transition metal") {
    categoryClass = "category-post-transition-metal";
} else if (cat === "transition metal") {
    categoryClass = "category-transition-metal";
} else if (cat.includes("alkali metal")) {
    categoryClass = "category-alkali-metal";
} else if (cat.includes("alkaline earth")) {
    categoryClass = "category-alkaline-earth-metal";
} else if (cat.includes("noble gas")) {
    categoryClass = "category-noble-gas";
} else if (cat.includes("metalloid")) {
    categoryClass = "category-metalloid";
} else if (cat.includes("lanthanide")) {
    categoryClass = "category-lanthanide";
} else if (cat.includes("actinide")) {
    categoryClass = "category-actinide";
} else if (cat.includes("nonmetal")) {
    categoryClass = "category-reactive-nonmetal";
}

card.classList.add(categoryClass);

    card.innerHTML = `<small>${element.number}</small><strong>${element.symbol}</strong>`;
    tableContainer.appendChild(card);
    
    // --- YAHAN SE CLICK EVENT START KARO ---
       card.addEventListener('click', () => {
    elName.innerText = element.name;
// Helper: Agar data na ho toh 'N/A' dikhaye
    const format = (val) => (val !== null && val !== undefined ? val : 'N/A');

    elDetails.innerHTML = `
        <div class="panel-header" style="background-color: #${element['cpk-hex'] || '444'}">
            <h3>${element.name} (${element.symbol}) ${element.number}</h3>
        </div>

        <div class="info-grid">
            <p><strong>Atomic Number:</strong> ${format(element.number)}</p>
            <p><strong>Atomic Mass:</strong> ${format(element.atomic_mass)}</p>
            <p><strong>Category:</strong> ${format(element.category)}</p>
            <p><strong>Phase:</strong> ${format(element.phase)}</p>
            <p><strong>Density:</strong> ${format(element.density)} g/cm³</p>
            <p><strong>Boil:</strong> ${format(element.boil)} K</p>
            <p><strong>Melt:</strong> ${format(element.melt)} K</p>
            <p><strong>Molar Heat:</strong> ${format(element.molar_heat)} J/(mol·K)</p>
            <p><strong>Electronegativity:</strong> ${format(element.electronegativity_pauling)}</p>
            <p><strong>Electron Affinity:</strong> ${format(element.electron_affinity)} kJ/mol</p>
            <p><strong>Block:</strong> ${format(element.block)}</p>
            <p><strong>period:</strong> ${format(element.period)}</p>
            <p><strong>Group:</strong> ${format(element.group)}</p>
        </div>

        <div class="section">
            <p><strong>Discovery:</strong> By ${format(element.discovered_by)}, Named by ${format(element.named_by)}</p>
            <p><strong>Shells:</strong> ${element.shells ? element.shells.join(', ') : 'N/A'}</p>
            <p><strong>Config:</strong> <code>${format(element.electron_configuration)}</code></p>
            <p><strong>Semantic Config:</strong> <code>${format(element.electron_configuration_semantic)}</code></p>
        </div>

        <p><strong>Summary:</strong> ${element.summary}</p>

        <div class="media-container">
            ${element.bohr_model_image ? `
                <div class="media-box">
                    <p><strong>Bohr Model:</strong></p>
                    <img src="${element.bohr_model_image}" style="width:100%;">
                </div>` : ''}
            
            ${element.spectral_img ? `
                <div class="media-box">
                    <p><strong>Spectral Signature:</strong></p>
                    <img src="${element.spectral_img.replace('/wiki/File:', '/w/index.php?title=Special:Redirect/file/')}" style="width:100%;">
                </div>` : ''}
        </div>
    
        ${element.bohr_model_3d ? `<button class="btn-3d" onclick="show3DModel('${element.bohr_model_3d}')">View 3D Model</button>` : ''}
    
   

    <div id="model-container" style="display: none; height: 300px; margin-top: 15px;">
        <button onclick="close3DView()" style="width: 100%; cursor:pointer;">Close 3D View</button>
        <model-viewer id="atom-viewer" src="" auto-rotate camera-controls style="width: 100%; height: 100%;"></model-viewer>
    </div>

    
        <a href="${element.source}" target="_blank" class="wiki-link">Read More on Wikipedia</a>
    `;
    panel.classList.add('active');
     });
        // --- YAHAN CLICK EVENT KHATAM ---
    });
})

.catch(err => console.error("Error loading JSON:", err));
// 3D View dikhane ke liye
function show3DModel(modelUrl) {
    const container = document.getElementById('model-container');
    const viewer = document.getElementById('atom-viewer');
    
    viewer.src = modelUrl; 
    container.style.display = "block"; 
}

// 3D View band karne ke liye (Close Button)
function close3DView() {
    const container = document.getElementById('model-container');
    const viewer = document.getElementById('atom-viewer');
    
    container.style.display = "none"; // Container chhup jayega
    viewer.src = ""; // Memory clear karne ke liye
};
// Filter Logic
document.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
        const cat = item.getAttribute('data-category');
        filterElements(cat);
    });
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.querySelectorAll('.element-card').forEach(card => {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
    });
});

function filterElements(category) {
    document.querySelectorAll('.element-card').forEach(card => {
        if(card.classList.contains('category-' + category)) {
            card.style.opacity = "1";
            card.style.transform = "scale(1.1)";
        } else {
            card.style.opacity = "0.1";
            card.style.transform = "scale(1)";
        }
    });
};