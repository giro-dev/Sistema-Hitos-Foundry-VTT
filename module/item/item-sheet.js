const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

/**
 * Extend the basic ItemSheetV2 with Handlebars support for the Hitos system.
 * @extends {HandlebarsApplicationMixin(ItemSheetV2)}
 */
export class HitosItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["hitos", "sheet", "item"],
    position: { width: 500, height: 400 },
    window: {
      resizable: true,
    },
    form: {
      submitOnChange: true,
    },
  };

  /** @override */
  static PARTS = {
    sheet: {
      template: "systems/hitos/templates/item/item-sheet.html",
    },
  };

  /**
   * Dynamically select the correct template based on item type.
   */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    this.constructor.PARTS.sheet.template =
      `systems/hitos/templates/item/${this.document.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const item = this.document;

    context.owner = item.isOwner;
    context.editable = this.isEditable;
    context.item = item;
    context.system = item.system;
    context.config = CONFIG.hitos;
    context.cssClass = this.isEditable ? "editable" : "locked";

    return context;
  }
}
