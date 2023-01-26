function addToCart(productId) {
    

    
    $.ajax({
        url:'/addtocart/'+productId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                
                let count =$('#cartCount').html()
            //   let count= document.getElementById(cartCount).innerHTML
                count = parseInt(count)+1
                $('#cartCount').html(count)
                // document.getElementById(cartCount).innerHTML=count
                // addToCartBtn.style.display = 'none';
                // goToCartBtn.style.display = 'flex';
            }
        }
    })
}
function addToWish(productId) {
    alert("kkkkkkkkkkkkkkkk")
    $.ajax({
        url: '/addToWishlist/' + productId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#wishCount').html()
                count = parseInt(count)+1
                $('#wishCount').html(count)
            } else {
                alert("already exists")
            }
        }
    })
}
function delWishItem(itemId) {
alert("enter")
	$.ajax({
		url: '/removeWish/' + itemId,
		method: 'get',
		success: (response) => {
			if (response.remove) {
            console.log("PPPPPPPPPPPPPPPP");

				let count = $('#wishCount').html()
				count = parseInt(count) - 1
				$('#wishCount').html(count)
				location.reload()
			}
		}
	})
}
function changeItemQty(itemId, prodId, count) {
	alert("enter ajax")
	$.ajax({
		url: 'changeItemQty',
		data: {
			item: itemId,
			product: prodId,
			change: parseInt(count),
			qty: $('#itemCount'+itemId).html()
		},
		method: 'post',
		success: (response) => {
			alert("responce")
			if (response.status) {
				let itemCount = $('#itemCount'+itemId).html()
				itemCount = parseInt(itemCount) + parseInt(count)
				$('#itemCount'+itemId).html(itemCount)

				let itemPrice = $('#itemPrice'+itemId).html()
				itemPrice = parseInt(itemPrice) + parseInt(response.price)
				$('#itemPrice'+itemId).html(itemPrice)

				$('#total').html(response.total)
				$('#totall').html(response.total)

			}
			if (response.remove) {
				location.reload()
			}
		}
	})
}
function editaddress(id) {
	console.log("oooo");
	$.ajax({
	  url: '/editaddress/' + id,
	  data: { id },
	  method: 'get',
	  dataType: "json",
	  encode: true,
	}).done(function (data) {
	  console.log(data);
	  $('#actionmodel').attr('action', '/updateaddress/' + data._id)
	  $('#name').val(data.Name)
	  $('#lastname').val(data.Lastname)

	  $('#house').val(data.House)
	  $('#post').val(data.Post)
	  $('#city').val(data.City)
	  $('#district').val(data.District)
	  $('#state').val(data.State)
	  $('#pin').val(data.Pin)
	  $('#country').val(data.Country)

	})

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
			var discount = response.discount
			$("#total").text(newTotal);
			// document.getElementById(total).innerHTML = newTotal
			// document.getElementById(discount).innerHTML = discount


			// $("#discount").text(discount);
			alert("Coupon applied! New total: " + newTotal);
			// $("#myDiv").show();
		} else if (response.notapplicable) {
			alert("Can't apply the coupon");
		} else if (response.expired) {
			alert("Coupon expired");
		}
		else {
			alert("Invalid coupon code or you have already applied this coupon");
		}
	}
});
})
