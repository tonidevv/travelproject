const api = "travel_recommendation_api.json"; // Asegúrate de que la ruta sea correcta
const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const txtInput = document.getElementById("txtInput"); // Input para búsqueda
const ListaFiltrada = document.getElementById("ListaFiltrada"); // Contenedor para mostrar resultados

const getJSONData = async function (api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return { status: 'ok', data };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Prevenir el envío del formulario al hacer clic en el botón de búsqueda
  document.querySelector(".search-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  btnSearch.addEventListener("click", async () => {
    let apiSearch = await getJSONData(api);
    if (apiSearch.status === 'ok') {
      const filteredLocations = filterLocations(apiSearch.data);
      printResult(filteredLocations);
    } else {
      console.error(apiSearch.data); // Mostrar mensaje de error en consola
    }
  });

  btnClear.addEventListener("click", () => {
    txtInput.value = "";
    ListaFiltrada.innerHTML = "";
  });
});

function filterLocations(data) {
  let text = txtInput.value.trim().toLowerCase();
  let results = [];

  // Filtrar por categorías generales
  if (text === 'countries' || text === 'country') {
    data.countries.forEach(country => {
      country.cities.forEach(city => {
        results.push(city);
      });
    });
  } else if (text === 'beaches' || text === 'beach') {
    data.beaches.forEach(beach => {
      results.push(beach);
    });
  } else if (text === 'temples' || text === 'temple') {
    data.temples.forEach(temple => {
      results.push(temple);
    });
  } else {
    // Filtrar por países y ciudades
    data.countries.forEach(country => {
      if (country.name.toLowerCase().includes(text)) {
        country.cities.forEach(city => {
          results.push(city);
        });
      }
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(text) || city.description.toLowerCase().includes(text)) {
          results.push(city);
        }
      });
    });

    // Filtrar templos
    data.temples.forEach(temple => {
      if (temple.name.toLowerCase().includes(text) || temple.description.toLowerCase().includes(text)) {
        results.push(temple);
      }
    });

    // Filtrar playas
    data.beaches.forEach(beach => {
      if (beach.name.toLowerCase().includes(text) || beach.description.toLowerCase().includes(text)) {
        results.push(beach);
      }
    });
  }

  return results;
}

function printResult(locations) {
  ListaFiltrada.innerHTML = "";
  locations.forEach(location => {
    const elemento = document.createElement("div");
    let htmlContentToAppend = `
      <div class="card" style="width: 35rem;">
        <img src="${location.imageUrl}" class="card-img-top" alt="${location.name}">
        <div class="card-body">
          <h4>${location.name}</h4>
          <p class="card-text">${location.description}</p>
        </div>
      </div>`;
    elemento.innerHTML = htmlContentToAppend;
    ListaFiltrada.appendChild(elemento);
  });
}
btnClear.addEventListener("click", () => {
  clearSearchResults();
});

function clearSearchResults() {
txtInput.value = "";
ListaFiltrada.innerHTML = "";
}
