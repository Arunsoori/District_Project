// var adminloginform = document.getElementById("adminlogin-form");

// adminloginform.addEventListener("submit", validate )


// function validate(event) {
// //   alert("enetr")
//   event.preventDefault();



//   var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   var psregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

//   const email= document.getElementById("adminloginemail").value
//   const password = document.getElementById("adminloginpassword").value;


//   if(!email){
//     document.getElementById("messageal").innerHTML="email is required"
//     return
//   }
//   if(!regex.test(email)) {
//     // alert("email invalid")
//     document.getElementById("messageal").innerHTML="not a valid email"
//     return
//   } 
//   if (!password) {
//     document.getElementById("messagealp").innerHTML = "Password is required";
//     return;
//   }
//   if (!psregex.test(password)) {
//     // alert("password invalid")
//     document.getElementById("messagealp").innerHTML = "not a valid password";
//     return;
//   }
// adminloginform.submit()

// }