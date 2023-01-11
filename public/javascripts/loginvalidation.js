var form = document.getElementById("login-form");

form.addEventListener("submit", validate )


function validate(event) {
  // alert("enetr")
  event.preventDefault();



  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var psregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const email= document.getElementById("loginemail").value
  const password = document.getElementById("loginpassword").value;


  if(!email){
    document.getElementById("messagei").innerHTML="email is required"
    return
  }
  if(!regex.test(email)) {
    // alert("email invalid")
    document.getElementById("messagei").innerHTML="not a valid email"
    return
  } 
  if (!password) {
    document.getElementById("messageulp").innerHTML = "Password is required";
    return;
  }
  if (!psregex.test(password)) {
    // alert("password invalid")
    document.getElementById("messageulp").innerHTML = "not a valid password";
    return;
  }
  form.submit()

}