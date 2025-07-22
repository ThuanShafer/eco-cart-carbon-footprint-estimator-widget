document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartSubtotalElement = document.getElementById('cart-subtotal');

  const carbonOffsetEstimator = document.querySelector('carbon-offset-estimator');

  function updateItemPrice(itemId, quantity) {
    const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
    const pricePerUnit = parseFloat(itemElement.dataset.pricePerUnit);
    const itemPriceElement = document.getElementById(`price-${itemId}`);
    const newPrice = (pricePerUnit * quantity).toFixed(2);
    itemPriceElement.textContent = `$${newPrice}`;
  }

  function updateCartSubtotal() {
    let totalSubtotal = 0;
    document.querySelectorAll('.cart-item').forEach(itemElement => {
        const itemId = itemElement.dataset.itemId;
        const quantity = parseInt(document.getElementById(`display-${itemId}`).textContent);
        const pricePerUnit = parseFloat(itemElement.dataset.pricePerUnit);
        totalSubtotal += (pricePerUnit * quantity);
    });

    const formattedTotal = totalSubtotal.toFixed(2);
    cartSubtotalElement.textContent = `$${formattedTotal} USD`;

    const subtotalChangeEvent = new CustomEvent('cartSubtotalChanged', {
        detail: { newSubtotal: parseFloat(formattedTotal) }
    });
    document.dispatchEvent(subtotalChangeEvent);
  }

  document.addEventListener('cartSubtotalChanged', (event) => {
      const newSubtotal = event.detail.newSubtotal;
      if (carbonOffsetEstimator) {
          carbonOffsetEstimator.subTotal = newSubtotal;
      }
  });


  cartItemsContainer.addEventListener('click', (event) => {
      const button = (event.target).closest('.quantity-button');
      if (!button) return;

      const itemId = button.dataset.itemId;
      const action = button.dataset.action;
      const quantityDisplay = document.getElementById(`display-${itemId}`);
      let currentQuantity = parseInt(quantityDisplay.textContent);

      if (action === 'increase') {
          currentQuantity++;
      } else if (action === 'decrease' && currentQuantity > 1) {
          currentQuantity--;
      } else {
          return;
      }

      quantityDisplay.textContent = currentQuantity.toString();
      updateItemPrice(itemId, currentQuantity);
      updateCartSubtotal();
  });

  updateCartSubtotal();
});
