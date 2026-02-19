async function fetchData() {
    const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `query {greeting}`,
        }),
    });
    const body = await response.json();
    return body.data.greeting;
}

fetchData().then((greeting) => {
    const greetingElement = document.getElementById("greeting");
    greetingElement.textContent = greeting;
});
