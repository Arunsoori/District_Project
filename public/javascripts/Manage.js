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
			}
			if (response.remove) {
				location.reload()
			}
		}
	})
}