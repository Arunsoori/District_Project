function addToCart(productId) {
  $.ajax({
    url: "/addtocart/" + productId,
    method: "get",
    success: (response) => {
      if (response.status) {
        swal("Success", "Item ! added to cart ", "success");

        let count = $("#cartCount").html();
        //   let count= document.getElementById(cartCount).innerHTML
        count = parseInt(count) + 1;
        $("#cartCount").html(count);
        // document.getElementById(cartCount).innerHTML=count
        // addToCartBtn.style.display = 'none';
        // goToCartBtn.style.display = 'flex';
      } else if (!response.login) {
        location.href = "/login";
      } else {
        swal("product already in cart! ");
      }
    },
  });
}
function addToWish(productId) {
  // alert("kkkkkkkkkkkkkkkk")
  $.ajax({
    url: "/addToWishlist/" + productId,
    method: "get",
    success: (response) => {
      if (response.status) {
        swal("success", "product added to wishlist", "success");
        let count = $("#wishCount").html();
        count = parseInt(count) + 1;
        $("#wishCount").html(count);
      } else if (!response.login) {
        location.href = "/login";
      } else {
        swal("", "product allready in wishlist", "warning");
      }
    },
  });
}
function delWishItem(itemId) {
  // alert("enter")
  $.ajax({
    url: "/removeWish/" + itemId,
    method: "get",
    success: (response) => {
      if (response.remove) {
        console.log("PPPPPPPPPPPPPPPP");

        let count = $("#wishCount").html();
        count = parseInt(count) - 1;
        $("#wishCount").html(count);
        location.reload();
      }
    },
  });
}
function changeItemQty(itemId, prodId, count) {
  // alert("enter ajax")
  $.ajax({
    url: "changeItemQty",
    data: {
      item: itemId,
      product: prodId,
      change: parseInt(count),
      qty: $("#itemCount" + itemId).html(),
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        let itemCount = $("#itemCount" + itemId).html();
        itemCount = parseInt(itemCount) + parseInt(count);
        $("#itemCount" + itemId).html(itemCount);

        let itemPrice = $("#itemPrice" + itemId).html();
        itemPrice = parseInt(itemPrice) + parseInt(response.price);
        $("#itemPrice" + itemId).html(itemPrice);

        $("#total").html(response.total);
        $("#totall").html(response.total);
      }
      if (response.remove) {
        location.reload();
      }
    },
  });
}
function editaddress(id) {
  console.log("oooo");
  $.ajax({
    url: "/editaddress/" + id,
    data: { id },
    method: "get",
    dataType: "json",
    encode: true,
  }).done(function (data) {
    //   console.log(data);
    $("#actionmodel").attr("action", "/updateaddress/" + data._id);
    $("#name").val(data.Name);
    $("#lastname").val(data.Lastname);

    $("#house").val(data.House);
    $("#post").val(data.Post);
    $("#city").val(data.City);
    $("#district").val(data.District);
    $("#state").val(data.State);
    $("#pin").val(data.Pin);
    $("#country").val(data.Country);
  });
}
//   $("#checkout-form").submit((e) => {
// 	e.preventDefault()
// 	$.ajax({
// 		url: '/placeorder',
// 		method: 'post',
// 		data: $('#checkout-form').serialize(),
// 		success: (response) => {
// 			alert(response)
// 			if (response.status) {
// 				location.href = '/order-success'
// 			}
// 		}
// 	})
// })
$("#apply-coupon").click(function () {
  var couponCode = $("#coupon-code").val();
  $.ajax({
    type: "POST",
    url: "/applycoupon",
    data: { code: couponCode },
    success: function (response) {
      if (response.success) {
        // Apply the discount to the total
        var newTotal = response.newTotal;
        var discount = response.discount;
        $("#total").text(newTotal);
        // document.getElementById(total).innerHTML = newTotal
        // document.getElementById(discount).innerHTML = discount

        // $("#discount").text(discount);
        // alert("Coupon applied! New total: " + newTotal);
        swal("Success", 'coupon applied! New total: " + newTotal ', "success");
        // $("#myDiv").show();
      } else if (response.notapplicable) {
        swal("", "You cant apply this coupon", "warning");
      } else if (response.expired) {
        swal("", "coupon expired", "warning");
      } else {
        swal("", "Your coupon is invalid or already applied", "warning");
      }
    },
  });
});

$("#checkout-form").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "/placeorder",
    method: "post",
    data: $("#checkout-form").serialize(),
    success: (response) => {
      if (response.codSuccess) {
        swal("Success", "Your order is placed", "success").then(() => {
          location.href = "/ordersuccess";
        });
      } else {
        razorpayPayment(response);
      }
    },
  });
});
function razorpayPayment(order) {
  var options = {
    key: "rzp_test_G3OiY6KuQ4uDEi", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "USD",
    name: "District 11",
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      verifyPayment(response, order);
    },
    prefill: {
      name: "name",
      email: "name@example.com",
      contact: "9000090000",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {});

  rzp1.open();
}
// function razorpayPayment(order) {

// 	var options = {
// 		"key": "rzp_test_G3OiY6KuQ4uDEi", // Enter the Key ID generated from the Dashboard
// 		"amount":order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
// 		"currency": "INR",
// 		"name": "Shoe Rack",
// 		"description": "Test Transaction",
// 		"image": "http://localhost:3000/images/logo.png",
// 		"order_id": order.id, //This is a sample Order ID. Pass the id obtained in the response of Step 1
// 		"handler": function (response) {
// 			console.log(response)
// 			verifyPayment(response,order);
// 		},
// 		"prefill": {
// 			"name": "ajay",
// 			"email":"ajay@gmail.com",
// 			"contact":"8714441727"
// 		},
// 		"notes": {
// 			"address": "Razorpay Corporate Office"
// 		},
// 		"theme": {

// 			"color": "#193D56"
// 		}
// 	};
// 	var rzp1 = new Razorpay(options);
// 	rzp1.open();
// }
function verifyPayment(payment, order) {
  $.ajax({
    url: "/verifypayment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        swal("Success", "Payment Sucess, your order is placed", "success").then(
          () => {
            location.href = "/ordersuccess";
          }
        );
      } else {
        swal("Failed", "Payment failed!!!!", "error").then(() => {
          location.href = "/cart";
        });
      }
    },
  });
}
