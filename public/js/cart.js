$(document).ready(() => {
  $(".add-to-cart").on("click", addToCart);
  $("select").change(function () {
    var data = $(this).find(":selected").data("value");
    console.log(data);
    $("#size").val(data.size);
    $("#price").val(data.price);
  });
});

function addToCart() {
  console.log("Button thêm được bấm");
  var id = $(this).data("id");
  var size = $("#size").val();
  var price = $("#price").val();
  var quantity = 1;
  if (size === "") {
    alert("Vui lòng chọn size của bạn")
  } else {
    $.ajax({
      url: "/gio-hang",
      type: "POST",
      data: { id, quantity, size, price },
      success: function (result) {
        $(".ti-bag").html(result.totalQuantity);
        console.log(result);
      },
    });
  }
}

function updateCart(id, quantity) {
  if (quantity == 0) {
    removeItemFromCart(id);
  } else {
    updateCartItem(id, quantity);
  }
}

function removeItemFromCart(id) {
  $.ajax({
    url: "/gio-hang",
    type: "DELETE",
    data: { id },
    success: function (result) {
      $(".ti-bag").html(result.totalQuantity);
      var totalPrice_cart = new Intl.NumberFormat("vi-VI", {
        style: "currency",
        currency: "VND",
      }).format(result.totalPrice);
      $("#totalPrice").html(totalPrice_cart);
      if (result.totalQuantity > 0) {
        $(`#item${id}`).remove();
      } else {
        $(".table").html(
          '<div class="alert alert-info tex-center">Không có sản phẩm trong giỏ hàng</div>'
        );
      }
      console.log(result);
    },
  });
}

function updateCartItem(id, quantity) {
  $.ajax({
    url: "/gio-hang",
    type: "PUT",
    data: { id, quantity },
    success: function (result) {
      $(".ti-bag").html(result.totalQuantity);

      var totalPrice_cart = new Intl.NumberFormat("vi-VI", {
        style: "currency",
        currency: "VND",
      }).format(result.totalPrice);
      $("#totalPrice").html(totalPrice_cart);
      var totalPrice_product = new Intl.NumberFormat("vi-VI", {
        style: "currency",
        currency: "VND",
      }).format(result.item.total);
      $(`#price${id}`).html(totalPrice_product);
    },
  });
}

function clearCart() {
  if (confirm("Bạn có chắc chắn muốn xóa giỏ hàng ?"))
    $.ajax({
      url: "/gio-hang/all",
      type: "DELETE",
      success: function () {
        $(".ti-bag").html(0);
        $(".table").html(
          '<div class="alert alert-info tex-center">Không có sản phẩm trong giỏ hàng</div>'
        );
      },
    });
}
