//-----Asignamos la url Base de la API -----
const urlBase = "https://mindicador.cl/api";

//Capturamos los elementos del HTML
const valorInput = document.querySelector("#valorInput");
const unidadCambio = document.querySelector("#monedaComvertir");
const span = document.querySelector("span");

let myChart = null;

async function convertirMoneda() {
  try {
    const pesos = valorInput.value;
    const { value: monedaSeleccionada } = unidadCambio;
    const valorMoneda = await obtenerApi(monedaSeleccionada);
    const valorFinal = (pesos / valorMoneda).toFixed(2);
    span.innerHTML = "Resultado: $" + valorFinal;
  } catch (error) {
    alert();
  }
}

async function obtenerApi(moneda) {
  try {
    const res = await fetch(urlBase + "/" + moneda);
    const data = await res.json();

    //Extraer el atributo serie desde Data con un destructuring
    const { serie } = data;
    const datos = dataChart(serie.slice(0, 10).reverse(), moneda);
    renderGrafica(datos);
    return serie[0].valor;
  } catch (error) {
    alert("UPS...Algo salio mal");
    console.log(error);
  }
}

//Crear funcion para reinderizar Chart
function renderGrafica(data) {
  const config = {
    type: "line",
    data,
  };
  const canvas = document.querySelector("#myChar");
  canvas.style.backgroundColor = "white";
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(canvas, config);
}

// Formatear la Fecha
function formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

// Data para el Grafico
function dataChart(serie, moneda) {
  const labels = serie.map(({ fecha }) => formatDate(fecha));
  const data = serie.map(({ valor }) => valor);
  const datasets = [
    {
      label: moneda,
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
}
