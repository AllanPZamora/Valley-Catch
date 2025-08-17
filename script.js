
let gameData = null;
let currentCategory = 'all';

function loadFishData() {
    fetch("assets/fishdata/fish.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON file not found');
            }
            return response.json();
        })
        .then(data => {
            gameData = data;
            createItemTable(currentCategory);
        })
        .catch(error => {
            console.error("Error loading fish.json:", error);
            // Create error message
            const infoContainer = document.getElementById("fish-info");
            infoContainer.className = "info-display";
            infoContainer.innerHTML = `
                <div style="color: red; text-align: center;">
                    <h3>Error Loading Data</h3>
                    <p>Could not load assets/fishdata/fish.json</p>
                    <p>Make sure the file exists and is accessible.</p>
                </div>
            `;
        });
}

function createItemTable(category) {
    if (!gameData) return;
    
    const tableContainer = document.getElementById("fish-table");
    let allItems = [];
    
    if (category === 'all') {
        // Combine all categories
        allItems = [
            ...gameData.fish.map(item => ({...item, category: 'fish'})),
            ...gameData.crabpots.map(item => ({...item, category: 'crabpots'})),
            ...gameData.foodstuffs.map(item => ({...item, category: 'foodstuffs'})),
            ...gameData.jellys.map(item => ({...item, category: 'jellys'}))
        ];
    } else {
        allItems = gameData[category] ? gameData[category].map(item => ({...item, category})) : [];
    }
    
    // Clear existing content
    tableContainer.innerHTML = '';
    
    if (allItems.length === 0) {
        tableContainer.innerHTML = '<div style="text-align: center; padding: 20px;">No items found in this category</div>';
        return;
    }
    
    // Create item cells
    allItems.forEach((item, index) => {
        const cell = document.createElement("div");
        const cellCategory = item.category;
        cell.className = `table-cell ${cellCategory === 'fish' ? '' : cellCategory.slice(0, -1) + '-cell'}`;
        cell.dataset.itemIndex = index;
        cell.dataset.category = cellCategory;
        
        // Create cell content
        const imagePath = `assets/fishimgs/${item.image}`;
        cell.innerHTML = `
            <img src="${imagePath}" alt="${item.name}" class="fish-image" onerror="this.style.display='none'; this.nextElementSibling.style.fontSize='12px';">
            <div class="fish-name">${item.name}</div>
        `;
        
        // Add click event
        cell.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.table-cell.selected').forEach(c => c.classList.remove('selected'));
            // Add selection to current cell
            cell.classList.add('selected');
            // Display item info
            displayItemInfo(item, cellCategory);
        });
        
        tableContainer.appendChild(cell);
    });
    
    // Fill remaining empty cells to complete the grid if needed
    const totalCells = Math.ceil(allItems.length / 10) * 10;
    const emptyCells = totalCells - allItems.length;
    
    for (let i = 0; i < emptyCells; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "table-cell empty-cell";
        tableContainer.appendChild(emptyCell);
    }
}

function displayItemInfo(item, category) {
    const infoContainer = document.getElementById("fish-info");
    infoContainer.className = "info-display";
    
    let infoHTML = `<div class="fish-info"><h3>${item.name}</h3>`;
    
    if (item.description) {
        infoHTML += `<p style="font-style: italic; margin-bottom: 15px;">"${item.description}"</p>`;
    }
    
    if (category === 'fish') {
        infoHTML += `
            <div class="fish-detail"><strong>Location:</strong> ${item.location}</div>
            <div class="fish-detail"><strong>Time:</strong> ${item.time}</div>
            <div class="fish-detail">
                <strong>Season:</strong> 
                ${Array.isArray(item.season) ? 
                    item.season.map(s => `<span class="season-tag">${s}</span>`).join(' ') : 
                    `<span class="season-tag">${item.season}</span>`}
            </div>
            <div class="fish-detail"><strong>Weather:</strong> ${item.weather}</div>
            <div class="fish-detail">
                <strong>Difficulty:</strong> 
                <span class="difficulty-tag">${item.difficulty}</span>
            </div>
            <div class="fish-detail">
                <strong>Behavior:</strong> 
                <span class="behavior-tag">${item.behavior}</span>
            </div>
            <div class="fish-detail"><strong>Size:</strong> ${item.size}"</div>
        `;
    } else if (category === 'crabpots') {
        infoHTML += `
            <div class="fish-detail"><strong>Source:</strong> ${item.source}</div>
            <div class="fish-detail"><strong>Size:</strong> ${item.size}"</div>
            <div class="fish-detail"><strong>XP:</strong> ${item.xp}</div>
            <div class="fish-detail"><strong>Energy:</strong> ${item.energy}</div>
        `;
    } else if (category === 'foodstuffs') {
        infoHTML += `
            <div class="fish-detail"><strong>Source:</strong> ${item.source}</div>
            <div class="fish-detail"><strong>XP:</strong> ${item.xp}</div>
            <div class="fish-detail"><strong>Energy:</strong> ${item.energy}</div>
            <div class="fish-detail"><strong>Health:</strong> ${item.health}</div>
        `;
    } else if (category === 'jellys') {
        infoHTML += `
            <div class="fish-detail"><strong>Source:</strong> ${item.source}</div>
            <div class="fish-detail"><strong>XP:</strong> ${item.xp}</div>
            <div class="fish-detail"><strong>Energy:</strong> ${item.energy}</div>
            <div class="fish-detail"><strong>Health:</strong> ${item.health}</div>
        `;
        if (item.buffs) {
            infoHTML += `<div class="fish-detail"><strong>Buffs:</strong> ${item.buffs.join(', ')}</div>`;
            infoHTML += `<div class="fish-detail"><strong>Duration:</strong> ${item.buffDuration}</div>`;
        }
    }
    
    infoHTML += '</div>';
    infoContainer.innerHTML = infoHTML;
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update current category and reload table
            currentCategory = button.dataset.category;
            createItemTable(currentCategory);
            
            // Reset info panel
            const infoContainer = document.getElementById("fish-info");
            infoContainer.className = "placeholder-box";
            infoContainer.innerHTML = `<p>Click on ${currentCategory === 'all' ? 'an item' : currentCategory === 'fish' ? 'a fish' : 'an item'} to see its information</p>`;
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFishData();
    initializeTabs();
});
