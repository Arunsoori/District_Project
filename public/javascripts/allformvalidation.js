var productform = document.getElementById("product-form");


productform.addEventListener("submit", validate )


function validate(event) {
  // alert("enetr")
  event.preventDefault();



  
  const productname= document.getElementById("productname").value
  const description = document.getElementById("description").value;
  const cost = document.getElementById("cost").value;
  const image = document.getElementById("imagep").value;

 

  if(!productname){
    document.getElementById("messagep").innerHTML="productname is required"
    return
  }
  if(!description) {
    // alert("email invalid")
    document.getElementById("messaged").innerHTML="description"
    return
  } 
  if (!cost) {
    document.getElementById("messagec").innerHTML = "cost is required";
    return;
  }
  if (!image) {
    document.getElementById("messagei").innerHTML = "image is required";
    return;
  }
  
  productform.submit()

}





