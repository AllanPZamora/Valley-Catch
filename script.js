fetch("assets/fishdata/fish.json")
  .then(response => response.json())
  .then(data => {
    console.log("Fish loaded:", data);

    // Example: show fish names in console
    data.forEach(fish => {
      console.log(fish.name);
    });
  })
  .catch(error => console.error("Error loading fish data:", error));