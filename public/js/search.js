// template to display results of search in nav bar
function resultShow(title, price, image, id) {
  // clone the template
  const template = document
    .getElementById("result-template")
    .content.cloneNode(true);
  // populate the template
  template.querySelector(".result-image").src = image;
  template.querySelector(".result-image").alt = title;
  // adding id for debug purpose
  template.querySelector(".result-id").innerText = id;
  template.querySelector(".result-link").classList.add(`resultId${id}`);
  template
    .querySelector(`.resultId${id}`)
    .addEventListener("click", function (e) {
      let inputId = id;
      localStorage.setItem("myId", inputId);
      window.location.href = "./pages/item.html";
    });
  template.querySelector(".result-title").innerText = title;
  template.querySelector(".result-price").innerText = price + " CC";
  // Tracking cliking count of Add button.
  template
    .querySelector(".result-add-btn")
    .addEventListener("click", function (e) {
      sessionStorage.setItem(
        "itemCount",
        !sessionStorage["itemCount"] ? 0 : sessionStorage["itemCount"]
      );
      let currentValue = parseInt(sessionStorage["itemCount"]);
      sessionStorage["itemCount"] = currentValue + 1;
      window.location.href = "/index.html";

      axios.post(`/shop/add/${id}`, {
        id:id,
    }).then(function(response){console.log(`sending id: ${response}`)}).catch(function(error){console.log(error)})

    });
  document.querySelector("#search-results").appendChild(template);
}

document
  .querySelector(".search-submit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // Delete existing searched that are being displayed.
    if (document.querySelector(".result-div")) {
      while (document.querySelector("#search-results").firstChild) {
        document.querySelector("#search-results").firstChild.remove();
      }
    }

    let search = document.querySelector(".search-input").value;
    let searchKeyword = search.toLowerCase() || null;

    axios
      .get("/shop")
      .then((response) => {
        const data = response.data;
        let resultArray = [];
        for (let x in data) {
          if (data[x].title.toLowerCase().includes(searchKeyword)) {
            resultArray.push(data[x]);
          }
        }
        if (resultArray.length === 0) {
          const message = "No result found.";
          document.querySelector("#search-results").innerHTML = message;
        } else {
          document.querySelector("#search-results").innerHTML = "";
        }
        resultArray.forEach((item) => {
          resultShow(item.title, item.price, item.image, item.id);
        });
        document.querySelector(".search-input").value = "";
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
        alert("Error retrieving information.");
      });
  });
