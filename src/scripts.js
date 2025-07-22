document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartSubtotalElement = document.getElementById('cart-subtotal');

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
    cartSubtotalElement.textContent = `$${totalSubtotal.toFixed(2)} USD`;

    const subtotalChangeEvent = new CustomEvent('cartSubtotalChanged', {
        detail: { newSubtotal: totalSubtotal.toFixed(2) }
    });
    document.dispatchEvent(subtotalChangeEvent);
  }

  cartItemsContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.quantity-button');
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

      quantityDisplay.textContent = currentQuantity;
      updateItemPrice(itemId, currentQuantity);
      updateCartSubtotal();
  });

  updateCartSubtotal();
});
