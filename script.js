const okayBtn = document.getElementById("okayBtn");

const firstScreen = document.getElementById("firstScreen");

const secondScreen = document.getElementById("secondScreen");


okayBtn.addEventListener("click", function(){

    firstScreen.style.display = "none";

    secondScreen.style.display = "flex";

});