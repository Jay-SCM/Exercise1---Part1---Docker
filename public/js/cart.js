let randomItemList = [];
let sum = 0;

window.onload = function () {
  const itemCount = sessionStorage.getItem("itemCount");

  if (itemCount < 1) {
    document.querySelector(".with-items").style.display = "block";
    document.querySelector(".with-items").innerText = "No item found.";
    document.querySelector(".checkout-btn").style.display = "none";
  } else {
    document.querySelector(".with-items").style.display = "block";

    const myChart = new Chart(randomItemList);
    myChart.randomItems();
  }
};

// template to display cart items (randomly generated depending on itemCount - Not real items)
function showCartItems(title, price, image, id, count) {
  const template = document
    .getElementById("cart-template")
    .content.cloneNode(true);
  template.querySelector(".cart-image").src = image;
  template.querySelector(".cart-image").alt = title;
  template.querySelector(".cart-item-div").classList.add(`cartId${id}`);
  // adding id for debug purpose
  template.querySelector(".cart-id").innerText = id;
  // To stop event bubbling
  template
    .querySelector(".cart-set-div")
    .addEventListener("click", function (e) {
      e.stopPropagation();
    });
  template
    .querySelector(".remove-btn-div")
    .addEventListener("click", function (e) {
      e.stopPropagation();
    });
  template.querySelector(".cart-link").classList.add(`cartId${id}`);
  template
    .querySelector(`.cartId${id}`)
    .addEventListener("click", function (e) {
      let inputId = id;
      localStorage.setItem("myId", inputId);
      window.location.href = "./item.html";
    });
  template.querySelector(".cart-title").innerText = title;
  template.querySelector(".cart-item-number").innerText = `${count} pc`;
  template.querySelector(".cart-price").innerText = price + " CC";
  template.querySelector(".cart-price").classList.add(`cartPriceId${id}`);
  // adding click event to decrease itemCount.
  template
    .querySelector(".cart-remove-btn")
    .addEventListener("click", function (e) {
      let currentValue = parseInt(sessionStorage["itemCount"]);
      sessionStorage["itemCount"] = currentValue - count;

      axios
        .post(`/shop/delete/${id}`, {
          id: id,
        })
        .then(function (response) {
          console.log(`sending id: ${response}`);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  document.querySelector("#cart-item-list").appendChild(template);
}

//Calculate grand total of items in the cart.
function grandTotal(id) {
  let partialSum = 0;
  const items = document.querySelectorAll(`.cartPriceId${id}`);
  const itemMap = new Map();

  items.forEach((item) => {
    if (itemMap.has(item.classList[1]) === false) {
      itemMap.set(item.classList[1], 1);
    } else {
      itemMap.set(item.classList[1], itemMap.get(item.classList[1]) + 1);
    }
  });

  for (let [key, value] of itemMap) {
    const singlePrice = document.querySelector(`.${key}`).innerText;
    partialSum = parseFloat(singlePrice.substring(0, singlePrice.length - 3));

    if (value < 1) {
      sum -= partialSum;
    } else {
      sum += partialSum;
    }
  }
  document.getElementById(
    "grand-total"
  ).innerHTML = `Grand Total: <span>${sum.toFixed(2)} CC</span>`;
}

//Chart class With actual Cart Items from /cart
class Chart {
  constructor(list) {
    this.list = list;
  }

  randomItems() {
    axios
      .get("/shop/cart")
      .then((response) => {
        const data = response.data;
        console.log(data);

        for (let i = 0; i < data.length; i++) {
          const cartIdDivs = document.querySelectorAll(".cart-id");
          console.log(data[i].id);
          randomItemList.push({
            id: data[i].id,
            category: data[i].category,
            price: data[i].price,
          });

          let count = 1;
          if (cartIdDivs) {
            for (let x in cartIdDivs) {
              if (cartIdDivs[x].innerText == data[i].id) {
                console.log("existing ID", cartIdDivs[x].innerText);
                count++;
                console.log(`count is ${count}`);
                // Hide duplicate item
                const dups = document.querySelectorAll(`.cartId${data[i].id}`);

                for (let k = 0; k < dups.length; k++) {
                  dups[k].style.display = "none";
                }
              }
            }
          }

          if (document.querySelector(`.cartId${data[i].id}`)) {
            showCartItems(
              data[i].title,
              data[i].price * count,
              data[i].image,
              data[i].id,
              count
            );
          } else {
            showCartItems(
              data[i].title,
              data[i].price,
              data[i].image,
              data[i].id,
              count
            );
          }
          grandTotal(data[i].id);
          this.#getCurrentItems();
        }
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
        alert("Error retrieving information.");
      });
  }

  #getCurrentItems() {
    if (!document.querySelectorAll(".cart-item-div")) {
      console.log("No items");
    } else {
      let listOfProductPerCategory = [];
      let count = {};
      let typeArr = [];
      let priceTotalPerCategory = {};
      let averageArray = [];

      //Extracting category name for each object so this results an array with duplicates
      this.list.forEach((product) => {
        listOfProductPerCategory.push({
          [product.category]: product.price,
        });
      });

      listOfProductPerCategory.forEach((element) => {
        count[Object.keys(element)] = (count[Object.keys(element)] || 0) + 1;
        priceTotalPerCategory[Object.keys(element)] =
          (parseFloat(priceTotalPerCategory[Object.keys(element)]) || 0) +
          parseFloat(Object.values(element));
      });

      // Separate keys and values as separate arrays to use Apache Echart's xAxis and yAxis
      for (let x in count) {
        typeArr.push(x);
      }

      // Change long category names to something short to fit screen better
      let newTypeArr = [];
      for (let i = 0; i < typeArr.length; i++) {
        if (
          typeArr[i] === "men's clothing" ||
          typeArr[i] === "women's clothing"
        ) {
          const newItem = typeArr[i].replace(" clothing", "");
          newTypeArr.push(newItem);
        } else {
          newTypeArr.push(typeArr[i]);
        }
      }

      //Get average per category
      for (let x in priceTotalPerCategory) {
        averageArray.push((priceTotalPerCategory[x] / count[x]).toFixed(2));
      }

      const myChart = echarts.init(document.getElementById("productsChart"));

      myChart.setOption({
        title: {
          text: "Category Average",
          textStyle: {
            color: "#808080",
            fontStyle: "italic",
            fontSize: 16,
            fontWeight: "lighter",
            fontFamily: "'Tiro Bangla', serif",
          },
        },
        //adding custom color for bars
        color: ["#808080"],
        xAxis: [
          {
            data: newTypeArr,
            axisLabel: { fontSize: 8 },
          },
          {
            position: "bottom",
            offset: 30,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: averageArray.map((price) => `$${price}`),
            axisLabel: { fontSize: 9 },
          },
        ],
        yAxis: {},
        series: [
          {
            name: "Category Average",
            type: "bar",
            data: averageArray,
          },
        ],
      });
    }
  }
}
