document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const item = {
            student_id: 1,
            item_name: document.getElementById("itemName").value.trim(),
            item_type: document.getElementById("itemType").value,
            category: document.getElementById("category").value.trim(),
            location: document.getElementById("location").value.trim(),
            item_date: document.getElementById("itemDate").value,
            description: document.getElementById("description").value.trim()
        };

        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(item)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to save item.");
            }

            alert("Success! Item saved to database.");
            form.reset();

        } catch (error) {
            alert("Error: " + error.message);
            console.error(error);
        }
    });
});

async function loadItems() {
    const itemsList = document.getElementById("itemsList");

    try {
        const response = await fetch("/api/items");

        if (!response.ok) {
            throw new Error("Failed to load items.");
        }

        const items = await response.json();

        if (items.length === 0) {
            itemsList.textContent = "No items reported yet.";
            return;
        }

        itemsList.replaceChildren();

        items.forEach((item) => {
            const card = document.createElement("div");
            const heading = document.createElement("h3");
            const type = document.createElement("p");
            const location = document.createElement("p");
            const date = document.createElement("p");
            const status = document.createElement("p");

            heading.textContent = item.item_name;
            type.textContent = "Type: " + item.item_type;
            location.textContent = "Location: " + item.location;
            date.textContent = "Date: " + String(item.item_date).slice(0, 10);
            status.textContent = "Status: " + item.status;

            card.append(heading, type, location, date, status);
            card.style.cssText =
                "background:white;padding:15px;margin:15px 0;border-radius:10px;border:1px solid #ddd";

            itemsList.appendChild(card);
        });
    } catch (error) {
        itemsList.textContent = "Could not load items. Please refresh.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadItems);