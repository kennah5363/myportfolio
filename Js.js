
const name = document.getElementById("name");
// if (person != null) {
//   name.innerHTML = "Hello " + person + " It's Me"
// }
var person = window.prompt("Enter Your Name");
if (person != null) {
  name.innerHTML = "Hello " + person + ", It's Me";
} else {
  window.alert("Please Refresh And Enter Your Name!");
}


var typed = new Typed(".multiple-text", {
  strings:["Frontend developer", "Hairdresser", "Beautician"],
  typeSpeed:100,
  backSpeed:100,
  backDelay:1000,
  loop:true
})


