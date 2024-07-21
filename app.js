// Mock data for products
const products = [
  { id: 1, name: "Product 1", price: 100, quantity: 1 },
  { id: 2, name: "Product 2", price: 150, quantity: 1 },
  { id: 3, name: "Product 3", price: 200, quantity: 1 },
];

// Cart data
let cart = [];

// Function to display products
function displayProducts() {
  let productHTML = "";
  products.forEach((product) => {
    productHTML += `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Price: $${product.price}</p>
                        <input type="number" id="quantity-${product.id}" class="form-control mb-2" value="${product.quantity}" min="1">
                        <button class="btn btn-success add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
  });
  $("#product-list-view").html(productHTML);
}

// Function to display cart
function displayCart() {
  if (cart.length === 0) {
    $("#cart").html("<p>Your cart is empty.</p>");
    $("#floating-cart").addClass("hidden");
    return;
  }
  let cartHTML = '<ul class="list-group">';
  cart.forEach((item) => {
    cartHTML += `
            <li class="list-group-item">
                ${item.name} - ${item.quantity} x $${item.price} = $${
      item.quantity * item.price
    }
                <button class="btn btn-danger btn-sm float-right remove-from-cart" data-id="${
                  item.id
                }">Remove</button>
            </li>
        `;
  });
  cartHTML += "</ul>";
  $("#cart").html(cartHTML);
  updateFloatingCart();
}

// Function to update the floating cart button
function updateFloatingCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  $("#cart-count").text(totalItems);
  $("#cart-total").text(totalPrice.toFixed(2));

  if (totalItems > 0) {
    $("#floating-cart").removeClass("hidden");
  } else {
    $("#floating-cart").addClass("hidden");
  }
}

// Add product to cart
$(document).on("click", ".add-to-cart", function () {
  const id = $(this).data("id");
  const quantity = $(`#quantity-${id}`).val();
  const product = products.find((p) => p.id == id);
  const cartItem = cart.find((item) => item.id == id);

  if (cartItem) {
    cartItem.quantity += parseInt(quantity);
  } else {
    cart.push({ ...product, quantity: parseInt(quantity) });
  }
  displayCart();
});

// Remove product from cart
$(document).on("click", ".remove-from-cart", function () {
  const id = $(this).data("id");
  cart = cart.filter((item) => item.id != id);
  displayCart();
});

// Function to review order
function reviewOrder() {
  let orderReview = "Review your order:\n\n";
  cart.forEach((item) => {
    orderReview += `${item.name} - ${item.quantity} x $${item.price} = $${
      item.quantity * item.price
    }\n`;
  });
  orderReview += `\nTotal: $${cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  )}`;
  $("#order-review").html(orderReview.replace(/\n/g, "<br>"));
}

// Navigation functions
function showStep(step) {
  if (step === 1) {
    $("#product-list-view").removeClass("hidden");
    $("#cart-view").addClass("hidden");
    $("#review-order-view").addClass("hidden");
    $("#step-1").addClass("bg-primary").removeClass("bg-secondary");
    $("#step-2").removeClass("bg-success");
    $("#step-3").removeClass("bg-info");
    $("#prev-btn").addClass("hidden");
    $("#next-btn").removeClass("hidden").text("Next");
  } else if (step === 2) {
    $("#product-list-view").addClass("hidden");
    $("#cart-view").removeClass("hidden");
    $("#review-order-view").addClass("hidden");
    $("#step-1").addClass("bg-secondary").removeClass("bg-primary");
    $("#step-2").addClass("bg-success").removeClass("bg-secondary");
    $("#step-3").removeClass("bg-info");
    $("#prev-btn").removeClass("hidden");
    $("#next-btn").removeClass("hidden").text("Next");
  } else if (step === 3) {
    $("#product-list-view").addClass("hidden");
    $("#cart-view").addClass("hidden");
    $("#review-order-view").removeClass("hidden");
    $("#step-1").removeClass("bg-primary");
    $("#step-2").addClass("bg-secondary").removeClass("bg-success");
    $("#step-3").addClass("bg-info");
    $("#prev-btn").removeClass("hidden");
    $("#next-btn").addClass("hidden");
    reviewOrder();
  }
}

let currentStep = 1;

// Initialize product display and set up event handlers
$(document).ready(function () {
  displayProducts();
  displayCart();
  showStep(currentStep);

  $("#next-btn").click(function () {
    currentStep++;
    showStep(currentStep);
  });

  $("#prev-btn").click(function () {
    currentStep--;
    showStep(currentStep);
  });

  $("#place-order-btn").click(function () {
    currentStep++;
    showStep(currentStep);
  });

  $("#confirm-order-btn").click(function () {
    alert("Order placed successfully!");
    // Reset application state
    cart = [];
    currentStep = 1;
    displayCart();
    showStep(currentStep);
  });

  // Event handler for the floating cart button
  $("#floating-cart").click(function () {
    currentStep = 2;
    showStep(currentStep);
  });
});
