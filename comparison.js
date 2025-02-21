const getOverview = document.getElementById('get-overview');
const urlParams = new URLSearchParams(window.location.search);
const selectedCranes = urlParams.get('cranes') ? urlParams.get('cranes').split(',') : [];

if (selectedCranes.length !== 2) {
    alert("Please select exactly two cranes for comparison.");
    window.location.href = "compare.html";
}

// Fetch crane data once
fetch('assets/cranes.json')
    .then(response => response.json())
    .then(data => {
        const cranes = data.cranes.filter(crane => selectedCranes.includes(crane.id));

        if (cranes.length !== 2) {
            alert("Invalid cranes selected.");
            window.location.href = "compare.html";
        }

        // Fill table with crane details
        document.getElementById('crane1-name').textContent = cranes[0].name;
        document.getElementById('crane2-name').textContent = cranes[1].name;

        const comparisonBody = document.getElementById('comparison-body');
        const attributes = ["manufacturer", "capacity", "power", "height", "price"];

        attributes.forEach(attr => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${attr.charAt(0).toUpperCase() + attr.slice(1)}</td>
                <td>${cranes[0][attr]}</td>
                <td>${cranes[1][attr]}</td>
            `;
            comparisonBody.appendChild(row);
        });

        // Generate Charts
        generateLoadPowerChart(cranes);
        generatePriceChart(cranes);

        // Generate AI Overview
        getOverview.addEventListener('click', () => generateAIOverview(cranes));
    })
    .catch(error => console.error("Error loading crane data:", error));

// Function to create Load vs Power Consumption Chart
function generateLoadPowerChart(cranes) {
    const ctx = document.getElementById('loadPowerChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Load Capacity (tons)', 'Power Consumption (kW)'],
            datasets: [
                {
                    label: cranes[0].name,
                    data: [cranes[0].capacity, cranes[0].power],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                },
                {
                    label: cranes[1].name,
                    data: [cranes[1].capacity, cranes[1].power],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                }
            ]
        }
    });
}

// Function to create Price Comparison Chart
function generatePriceChart(cranes) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [cranes[0].name, cranes[1].name],
            datasets: [{
                data: [cranes[0].price, cranes[1].price],
                backgroundColor: ['#ff6600', '#007bff']
            }]
        }
    });
}

// Function to generate AI Overview
function generateAIOverview(cranes) {
    let container = document.getElementById("overview-text");
    
    // Show skeleton loader
    container.innerHTML = `
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
    `;

    // Simulate AI processing time
    setTimeout(() => {
        let overview = `
            <p>Comparing <b>${cranes[0].name}</b> and <b>${cranes[1].name}</b>:</p>
            <ul>
                <li><b>${cranes[0].name}</b> has a load capacity of <b>${cranes[0].capacity} tons</b>, while <b>${cranes[1].name}</b> has <b>${cranes[1].capacity} tons</b>.</li>
                <li><b>Power Usage:</b> <b>${cranes[0].name}</b> uses <b>${cranes[0].power} kW</b>, whereas <b>${cranes[1].name}</b> uses <b>${cranes[1].power} kW</b>.</li>
                <li><b>Price:</b> <b>${cranes[0].name}</b> costs <b>Rs.${cranes[0].price}</b>, compared to <b>Rs.${cranes[1].price}</b> for <b>${cranes[1].name}</b>.</li>
            </ul>
        `;

        let bestCrane = cranes[0].capacity > cranes[1].capacity ? cranes[0].name : cranes[1].name;
        let bestReason = cranes[0].capacity > cranes[1].capacity ? "higher load capacity" : "lower power consumption and cost-efficiency";

        overview += `<p>✅ <b>Recommendation:</b> <b>${bestCrane}</b> is the better choice due to its <b>${bestReason}</b>.</p>`;

        // Replace skeleton with actual content
        container.innerHTML = overview;
    }, 2000); // Simulate AI delay (2 seconds)
}
