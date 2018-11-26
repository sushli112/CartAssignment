import {getItemsForCart} from "./ShoppingCartService"
const Handlebars = require("handlebars")

export const loadShoppingCart = () => {
  getItemsForCart().then(itemdata => {
    createCartView(itemdata)
  })
}

// method to generate the shopping cart view
const createCartView = itemdata => {
  console.log("inside createCartView method..")

  console.log(itemdata)

  var itemList = itemdata.transaction[0].item_list

  // Used Handlebars to generate the item details view of cart
  var itemTemplate = document.getElementById("itemTemplate").innerHTML
  var compiledItemTemplate = Handlebars.compile(itemTemplate)
  var generatedItemHtml = compiledItemTemplate(itemList)

  var cartContainer = document.getElementById("ShoppingCart")
  cartContainer.innerHTML = generatedItemHtml

  // Used Handlebars to generate the amount calculation view of cart
  var finalCalsulation = itemdata.transaction[0].amount
  var finalCalculationTemplate = document.getElementById("finalCalculation")
    .innerHTML
  var compiledfinalCalculation = Handlebars.compile(finalCalculationTemplate)
  var generatedfinalCalculation = compiledfinalCalculation(finalCalsulation)

  var calculationContainer = document.getElementById("CalculationContainer")
  calculationContainer.innerHTML = generatedfinalCalculation

  // Used Handlebars to generate the shipment details view of cart
  var shipmentAddress = itemdata.transaction[0].item_list.shipping_address
  var shipmentAddressTemplate = document.getElementById("shipmentAddress")
    .innerHTML
  var compiledshipmentAddressTemplate = Handlebars.compile(
    shipmentAddressTemplate
  )
  var generatedshipmentAddressTemplate = compiledshipmentAddressTemplate(
    shipmentAddress
  )

  var shipmentAddressContainer = document.getElementById("shipmentContainer")
  shipmentAddressContainer.innerHTML = generatedshipmentAddressTemplate
}
