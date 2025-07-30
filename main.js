// Fetch Fun Fact from the API
const funFactApi = "https://api.api-ninjas.com/v1/facts?";
const  funFactApiKey = "2PEZcWfNMed2t9E75rD0KA==f0IhxzBGJslzMW7C";
const fact = document.querySelector("#fun-fact");

// authenticate the API key
const params = {
    method: "GET",
    headers: {
        "X-Api-Key": funFactApiKey
    }
};

async function fetchFunFact() {
    try {
        const response = await fetch(funFactApi, params);
        console.log("Response from fun fact API:", response);
        return await response.json();
    } catch (error) {
        console.error("Error fetching fun fact:", error);
        fact.textContent = "Could not fetch fun fact. Please try again later.";
    }
}

fetchFunFact();

async function showFunFact() {
    let facts = await fetchFunFact();
    if (facts && facts.length > 0) {
        fact.textContent = facts[0].fact;
    } else {
        fact.textContent = "No fun fact available at the moment.";
    }
}

showFunFact();