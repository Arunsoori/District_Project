var signupform = document.getElementById("signup-form");
// var form = document.getElementById("login-form");

// add an event listener to the form's submit event
signupform.addEventListener("submit", validate);

function validate(event) {
  event.preventDefault();
  // alert("enetr")
  // console.log(">>>>>>");

  // define the regular expression for an email address

  var regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var psregex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  // var cpsregex=  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmpassword").value;

  document.getElementById("namem").innerHTML = "";
  document.getElementById("message").innerHTML = "";
  document.getElementById("messagep").innerHTML = "";
  document.getElementById("messagecp").innerHTML = "";

  //   if(!regex.test(name)) {
  //     // alert("email invalid")
  //     document.getElementById("message").innerHTML="not a valid email"
  // return
  // }
  if (!name) {
    document.getElementById("namem").innerHTML = "name is required";
    return;
  }
  if (!email) {
    document.getElementById("message").innerHTML = "email is required";
    return;
  }

  if (!password) {
    document.getElementById("messagep").innerHTML = "Password is required";
    return;
  }
  if (!confirmpassword) {
    document.getElementById("messagecp").innerHTML = "Repetation  is required";
    return;
  }

  if (!regex.test(email)) {
    // alert("email invalid")
    document.getElementById("message").innerHTML = "not a valid email";
    return;
  }
  if (!psregex.test(password)) {
    // alert("password invalid")
    document.getElementById("messagep").innerHTML = "not a valid password";
    return;
  }
  if (password !== confirmpassword) {
    // alert('Passwords do not match');
    document.getElementById("messagecp").innerHTML = "password do not match";
    return;
  }
  console.log("yf");

  signupform.submit()
  

}
