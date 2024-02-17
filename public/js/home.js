let homeImage = "";
const categoryArray = [".women", ".men", ".jewelery", ".electronics"];

//sessionStorage is used so that count is persistent during session, instead of localStorage.
window.onload = function () {
  const itemCount = sessionStorage.getItem("itemCount");
  if (itemCount < 1) {
    document.querySelector(".itemCount").innerHTML = "";
  } else {
    document.querySelector(".itemCount").innerHTML = itemCount;
  }
  loadHomeImage();
  getCategorySpecificAPI();
};

// template to create home image
function homeImagesShow(image, title, id) {
  // clone the template
  const template = document
    .getElementById("homeImages-template")
    .content.cloneNode(true);
  // populate the template
  template.querySelector(".homeImage").src = image;
  template.querySelector(".homeImage").alt = title;
  template.querySelector(".home-img-link").classList.add(`id${id}`);
  template.querySelector(`.id${id}`).addEventListener("click", function (e) {
    let inputId = id;
    localStorage.setItem("myId", inputId);
    window.location.href = "../item.html";
  });
  // include the populated template into the page
  document.querySelector("#homeImages-show").appendChild(template);
}

// template to create individual item displayed per categories
function addCard(title, price, image, id) {
  const template = document
    .getElementById("card-template")
    .content.cloneNode(true);
  template.querySelector(".card-image").src = image;
  template.querySelector(".card-image").alt = title;
  template.querySelector(".card-id").innerText = id;
  // adding click event for individual item.
  template.querySelector(".card-link").classList.add(`id${id}`);
  template.querySelector(`.id${id}`).addEventListener("click", function (e) {
    let inputId = id;
    localStorage.setItem("myId", inputId);
    window.location.href = "../item.html";
  });
  template.querySelector(".card-title").innerText = title;
  template.querySelector(".card-price").innerText = price + " CC";
  template.querySelector(".individual-card").classList.add(`cardId${id}`);
  template.querySelector(".card-btn").classList.add(`btnId${id}`);
  template
    .querySelector(`.cardId${id}`)
    .addEventListener("mouseover", function () {
      document.querySelector(`.btnId${id}`).style.display = "block";
    });
  template
    .querySelector(`.cardId${id}`)
    .addEventListener("mouseout", function () {
      document.querySelector(`.btnId${id}`).style.display = "none";
    });

  template.querySelector(`.btnId${id}`).addEventListener("click", function (e) {
    // ternary operator to set 0 for initial value of itemCount variable
    // to avoid error since it's initially undefined.
    sessionStorage.setItem(
      "itemCount",
      !sessionStorage["itemCount"] ? 0 : sessionStorage["itemCount"]
    );
    // value of sessionStorage is not number so using parseInt.
    let currentValue = parseInt(sessionStorage["itemCount"]);
    sessionStorage["itemCount"] = currentValue + 1;
    window.location.href = "/index.html";

    axios.post(`/shop/add/${id}`, {
        id:id,
    }).then(function(response){console.log(`sending id: ${response}`)}).catch(function(error){console.log(error)})

  });
  document.querySelector("#card-list").appendChild(template);
}

//To load Home Image
function loadHomeImage() {
  axios
    .get("/shop")

    .then((response) => {
      const data = response.data;
      console.log(data);
      // randomise image on home page
      homeImage = data[Math.floor(Math.random() * data.length)];
      homeImagesShow(homeImage.image, homeImage.title, homeImage.id);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      alert("Error retrieving information.");
    });
}

// To add click event for each categories in the nav bar.
function getCategorySpecificAPI() {
  for (let key in categoryArray) {
    document
      .querySelector(categoryArray[key])
      .addEventListener("click", function (event) {
        event.preventDefault();
        //Remove previously listed category
        if (document.querySelector(".card-div")) {
          while (document.querySelector("#card-list").firstChild) {
            document.querySelector("#card-list").firstChild.remove();
          }
        }
        document.querySelector("#homeImages-show").style.display = "none";
        (categoryArray[key] === ".women"
          ? axios.get("/shop/women")
          : categoryArray[key] === ".men"
          ? axios.get("shop/men")
          : axios.get(`shop/${categoryArray[key].substring(1)}`)
        )
          .then((response) => {
            const data = response.data;
            data.forEach((item) => {
              addCard(item.title, item.price, item.image, item.id);
            });
          })
          .catch((error) => {
            console.error(`Error: ${error.message}`);
            alert("Error retrieving information.");
          });
      });
  }
}
