const apiUrl = "https://dummyjson.com/products",
  $template = document.getElementById("template-card").content, // ".content" para utilizar su contenido, no el elemento <template> en si.
  $cards = document.querySelector(".cards"),
  $fragment = document.createDocumentFragment(); // para no pegarle al DOM en cada iteracción, sino al tenerlo completo.

const loadProds = async (url) => {
  try {
    $cards.innerHTML = `<img class="loader" src="./assets/loader.svg" alt="loading">`;
    const prods = await fetch(url).then((res) => res.json());
    if (!prods) throw { status: res.status, statusText: res.statusText };

    prods.products.forEach((prod) => {
      // completamos los elementos del template
      $template.querySelector("figcaption").textContent = prod.title;
      $template.querySelector("p").textContent = prod.description;
      $template.querySelector("h3").textContent = `$ ${prod.price}`;
      $template.querySelector("img").src = prod.images
        ? prod.images[0]
        : `./assets/noimage.png`;
      $template.querySelector("img").alt = prod.title;
      $template.querySelector("a").href = prod.images[0];
      $template.querySelector("a").target = prod.images ? `_blank` : `_self`;

      // guardamos el template en un clon para poder reutilizar el template, atento al segundo parámetro "true"
      let $clone = document.importNode($template, true);
      // en cada vuelta del forEach pegamos el clon al fragment
      $fragment.appendChild($clone);
    });
    $cards.innerHTML = "";
    // al finalizar el forEach impactamos una sola vez al DOM, con el fragment
    $cards.appendChild($fragment);
  } catch (error) {
    console.warn(error);
    let message = error.statusText || "Error obteniendo datos de API";
    $cards.innerHTML = `<p>Error # ${error.status} - ${message}</p>`;
  }
};

document.addEventListener("DOMContentLoaded", () => loadProds(apiUrl));
