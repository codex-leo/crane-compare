const urlParams = new URLSearchParams(window.location.search);
const selectedCranes = urlParams.get('cranes') ? urlParams.get('cranes').split(',') : [];

if (selectedCranes.length !== 2) {
    alert("Please select exactly two cranes for comparison.");
    window.location.href = "compare.html";
}

// Fetch crane data from cranes.json
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

        // Generate Graphs
        generateLoadPowerChart(cranes);
        generatePriceChart(cranes);
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
