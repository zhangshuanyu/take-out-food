const loadAllItems = require("../src/items.js");
const loadPromotions = require("../src/promotions.js");

module.exports = function bestCharge(inputs) {
  var allItems = loadAllItems();
  var discount = loadPromotions();
  var items = receiptItems(inputs, allItems);
  var promotions = calPromotions(items, discount);
  var expecteText = printReceipt(items, promotions);
    console.log(expecteText);
    return expecteText;
  }
function receiptItems(inputs, allItems) {
  var  items = [];
  inputs.forEach(input => {
    var input_id =  input.split(" x ")[0];
    var input_count = parseInt(input.split(" x ")[1]);
    allItems.forEach(item => {
      if (item.id == input_id) {
        items.push({
          id: input_id,
          name: item.name,
          count: input_count,
          price: item.price
        });
      }
    });
  });
  return items;
}
function calPromotions(items, discount)  {
  var promotions = {};
  var total = 0;
  var save1 = 0;
  var save2 = 0;
  var save2_arr = [];
  items.forEach(item => {
    total += item.price * item.count;
    if (discount[1].items.includes(item.id)) {
      save2 += parseInt(item.price * item.count / 2);
      save2_arr.push(item.name);
    }
  });
  if (Math.floor(total / 30) > 0) {
    save1 = Math.floor(total / 30) * 6;
  }
  if (save1 == save2 && save2 == 0) {
    promotions = {
      type: 'none',
      name: '',
      save: 0
    };
    return promotions;
  }
  if (save1 >= save2) {
    promotions = {
      type: "满30减6",
      name: "",
      save: save1
    };
  }else if(save1 < save2) {
    promotions = {
      type: "指定半价",
      name: save2_arr,
      save: save2
    };
  }
  return promotions;
}
function printReceipt(items, promotions) {
  var total = 0;
  var menu;
  var menu_top = "============= 订餐明细 =============\n";
  items.forEach(item => {
    menu_top += item.name + " x " + item.count + " = " + item.price * item.count + "元\n";
    total += item.count * item.price;
  });
  if (promotions.type == "none") {
    menu = menu_top + "-----------------------------------\n" + "总计："
      + total +"元\n"+"===================================";
    return menu;
  }
  if (promotions.type == "满30减6") {
    menu = menu_top + "-----------------------------------\n" + "使用优惠:\n" + "满30减6元，省" + promotions.save + "元\n"
      + "-----------------------------------\n"+ "总计：" + (total - promotions.save)+ "元\n"
      + "===================================";
    return menu;
  }
  if (promotions.type == "指定半价") {
    menu = menu_top + "-----------------------------------\n" + "使用优惠:\n" + "指定菜品半价(" +
      promotions.name.join("，") + ")，省" + promotions.save + "元\n" +"-----------------------------------\n"+
      "总计：" + (total - promotions.save)+ "元\n" + "===================================";
    return menu;
  }
}
