/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class HitosItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    let img = CONST.DEFAULT_TOKEN;
    switch (this.type) {
      case "item":
        img = "/systems/hitos/assets/icons/item.svg";
        break;
      case "armor":
        img = "/systems/hitos/assets/icons/armor.svg";
        break;
      case "weapon":
        img = "/systems/hitos/assets/icons/weapon.svg";
        break;
    }
    if (this.img === "icons/svg/item-bag.svg") this.img = img;

    super.prepareData();
  }
}
