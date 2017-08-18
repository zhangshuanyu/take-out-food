const loadAllItems = require("../src/items.js");
const loadPromotions = require("../src/promotions.js");

module.exports = function bestCharge(inputs) {
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let items = get_items(inputs, allItems);
    let discount = get_discount(items, promotions);
    let menu = get_menu(items, discount);
    console.log(menu);
    return menu;
  }
function get_items(inputs, allItems) {
  let  items = [];
  inputs.forEach(input => {
    let input_id =  input.split(" x ")[0];
    let input_count = parseInt(input.split(" x ")[1]);
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
function get_discount(items, promotions) {
  let discount = {};
  let total = 0;
  let save1 = 0;
  let save2 = 0;
  let save2_arr = [];
  items.forEach(item => {
    total += item.price * item.count;
    if (promotions[1].items.includes(item.id)) {
      save2 += parseInt(item.price * item.count / 2);
      save2_arr.push(item.name);
    }
  });
  if (Math.floor(total / 30) > 0) {
    save1 = Math.floor(total / 30) * 6;
  }
  if (save1 == save2 && save2 == 0) {
    discount = {
      type: 'none',
      name: '',
      save: 0
    };
    return discount;
  }
  if (save1 >= save2) {
    discount = {
      type: "满30减6",
      name: "",
      save: save1
    };
  }else if(save1 < save2) {
    discount = {
      type: "指定半价",
      name: save2_arr,
      save: save2
    };
  }
  return discount;
}
function get_menu(items, discount) {
  let total = 0;
  let menu;
  let menu_top = "============= 订餐明细 =============\n";
  items.forEach(item => {
    menu_top += item.name + " x " + item.count + " = " + item.price * item.count + "元\n";
    total += item.count * item.price;
  });
  if (discount.type == "none") {
    menu = menu_top + "-----------------------------------\n" + "总计："
      + total +"元\n"+"===================================";
    return menu;
  }
  if (discount.type == "满30减6") {
    menu = menu_top + "-----------------------------------\n" + "使用优惠:\n" + "满30减6元，省" + discount.save + "元\n"
      + "-----------------------------------\n"+ "总计：" + (total - discount.save)+ "元\n"
      + "===================================";
    return menu;
  }
  if (discount.type == "指定半价") {
    menu = menu_top + "-----------------------------------\n" + "使用优惠:\n" + "指定菜品半价(" +
      discount.name.join("，") + ")，省" + discount.save + "元\n" +"-----------------------------------\n"+
      "总计：" + (total - discount.save)+ "元\n" + "===================================";
    return menu;
  }
}
