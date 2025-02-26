fetch("assets/cranes.json")
    .then(response => response.json())
    .then(data => {
        const craneContainer = document.getElementById("craneContainer");

        data.cranes.forEach(crane => {
            let craneCard = document.createElement("div");
            craneCard.classList.add("crane-card");
            craneCard.dataset.craneId = crane.id; // Store crane ID in dataset

            craneCard.innerHTML = `
                <img src="${crane.image}" alt="${crane.name}">
                <h3>${crane.name}</h3>
                <p>Manufacturer: ${crane.manufacturer}</p>
                <p>Capacity: ${crane.capacity} tons</p>
                <p>Price: Rs.${crane.price}</p>
                <button onclick="viewDetails('${crane.id}')">View Details</button>
            `;

            // Add selection toggle on click
            craneCard.addEventListener("click", () => {
                if (craneCard.classList.contains("selected")) {
                    craneCard.classList.remove("selected");
                } else {
                    let selected = document.querySelectorAll(".crane-card.selected");
                    if (selected.length < 2) {
                        craneCard.classList.add("selected");
                    }
                }
            });

            craneContainer.appendChild(craneCard);
        });

        //search-feature
        const search = document.getElementById("Searchinput");

        search.addEventListener("input", () => {
            const input = search.value.toLowerCase();
            let found = false;
            document.querySelectorAll(".crane-card").forEach(item => {
                const craneName = item.querySelector("h3").textContent.toLowerCase();
                if (craneName.includes(input)) {
                    item.style.display = "block"; 
                    found = true;
                } else {
                    item.style.display = "none";
                }
                
                if(found){
                    notFound.style.display = "none";
                } else {
                    notFound.innerHTML = "No cranes found with that name";
                    notFound.style.display = "block";
                }
            });
        });
    })
    .catch(error => console.error("Error loading crane data:", error));
const notFound = document.getElementById("notFound");
// Function to redirect users to compare selected cranes
function compareCranes() {
    const selectedCranes = [];

    // Loop through selected crane cards and get their IDs
    document.querySelectorAll(".crane-card.selected").forEach(card => {
        selectedCranes.push(card.dataset.craneId);
    });

    if (selectedCranes.length !== 2) {
        alert("Please select exactly two cranes for comparison.");
        return;
    }

    // Redirect to comparison page with selected crane IDs
    window.location.href = `comparison.html?cranes=${encodeURIComponent(selectedCranes.join(","))}`;
}

// Function to handle "View More" button click
function viewDetails(craneId) {
    window.location.href = `details.html?crane=${encodeURIComponent(craneId)}`;
}
