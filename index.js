// const EventEmitter = require("events");
// const stockData = require("./stock-list.json");

// class OrderProcessor extends EventEmitter {
//   placeOrder(orderData) {
//     const orderNumber = orderData[0].orderNumber;
//     this.emit("PROCESSING_STARTED", orderNumber);

//     let isValid = true;
//     let errorObject = null;

//     orderData[0].lineItems.forEach((lineItem) => {
//       const matchingStock = stockData.find(
//         (stockItem) => stockItem.id === lineItem.itemId
//       );
//       if (matchingStock.stock < lineItem.quantity) {
//         isValid = false;
//         errorObject = {
//           orderNumber,
//           itemId: lineItem.itemId,
//           reason: "INSUFFICIENT_STOCK",
//         };
//         return;
//       }
//     });

//     if (orderData[0].lineItems.length === 0) {
//       isValid = false;
//       errorObject = {
//         orderNumber,
//         reason: "LINEITEMS_EMPTY",
//       };
//     }

//     if (isValid) {
//       this.emit("PROCESSING_SUCCESS", orderNumber);
//     } else {
//       this.emit("PROCESSING_FAILED", errorObject);
//     }
//   }
// }

// module.exports = OrderProcessor;

const EventEmitter = require("events");
const stockData = require("./stock-list.json");

class OrderProcessor extends EventEmitter {
  placeOrder(orderData) {
    const orderNumber = orderData.orderNumber;
    this.emit("PROCESSING_STARTED", orderNumber);

    const lineItems = orderData.lineItems;
    if (lineItems.length === 0) {
      const failureData = {
        orderNumber: orderNumber,
        reason: "LINEITEMS_EMPTY",
      };
      this.emit("PROCESSING_FAILED", failureData);
      return;
    }

    for (const item of lineItems) {
      const itemId = item.itemId;
      const requestedQuantity = item.quantity;
      const matchingStock = stockData.find((s) => s.id === itemId).stock;
      if (requestedQuantity > matchingStock) {
        const failureData = {
          orderNumber: orderNumber,
          itemId: itemId,
          reason: "INSUFFICIENT_STOCK",
        };
        this.emit("PROCESSING_FAILED", failureData);
        return;
      }
    }

    this.emit("PROCESSING_SUCCESS", orderNumber);
  }
}

module.exports = OrderProcessor;
