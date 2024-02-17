// Days.js for footer

function findYear() {
  document.querySelector(".year").innerHTML = dayjs().year();
}

findYear();
