import { _onCheckRoll, _onInitRoll, _onAttackRoll, _onStatusRoll, _onDramaRoll } from "../dice.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/**
 * Extend the basic ActorSheetV2 with Handlebars support for the Hitos system.
 * @extends {HandlebarsApplicationMixin(ActorSheetV2)}
 */
export class HitosActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["hitos", "sheet", "actor"],
    position: { width: 740, height: 700 },
    actions: {
      itemCreate: HitosActorSheet._onItemCreate,
      itemEdit: HitosActorSheet._onItemEdit,
      itemDelete: HitosActorSheet._onItemDelete,
      itemQuantityPlus: HitosActorSheet._onItemQuantityPlus,
      itemQuantityMinus: HitosActorSheet._onItemQuantityMinus,
      rollCheck: HitosActorSheet._onRollCheck,
      rollInit: HitosActorSheet._onRollInit,
      rollAttack: HitosActorSheet._onRollAttack,
      rollStatus: HitosActorSheet._onRollStatus,
      habilidadEdit: HitosActorSheet._onHabilidadEdit,
      itemToggle: HitosActorSheet._onItemToggle,
      healthInc: HitosActorSheet._onHealthInc,
      healthDec: HitosActorSheet._onHealthDec,
      mentalInc: HitosActorSheet._onMentalInc,
      mentalDec: HitosActorSheet._onMentalDec,
    },
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
      template: "systems/hitos/templates/actor/actor-sheet.html",
    },
  };

  /** @override */
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    return buttons;
  }

  /**
   * Dynamically select the correct template based on actor type.
   */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    // Override the template per actor type
    this.constructor.PARTS.sheet.template =
      `systems/hitos/templates/actor/${this.document.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.document;
    const source = actor.toObject();
    const items = Array.from(actor.items);

    context.editable = this.isEditable;
    context.actor = actor;
    context.system = actor.system;
    context.items = items;
    context.dtypes = ["String", "Number", "Boolean"];
    context.cssClass = this.isEditable ? "editable" : "locked";

    // Classify items
    this._prepareCharacterItems(context);

    // Enrich HTML fields
    context.enrichedBiografia = await TextEditor.enrichHTML(actor.system.biografia ?? "");
    context.enrichedExtras = await TextEditor.enrichHTML(actor.system.extras ?? "");

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);

    if (!this.isEditable) return;

    // Right-click on hito-disable to toggle class
    this.element.querySelectorAll(".hito-disable").forEach((el) => {
      el.addEventListener("contextmenu", (ev) => {
        el.classList.toggle("input-header-disabled");
      });
    });
  }

  /* -------------------------------------------- */
  /*  Action Handlers                             */
  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset.
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The element that triggered the action
   */
  static async _onItemCreate(event, target) {
    const type = target.dataset.type;
    const data = foundry.utils.duplicate(target.dataset);
    delete data["type"];
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    return this.document.createEmbeddedDocuments("Item", [itemData]);
  }

  static _onItemEdit(event, target) {
    const li = target.closest(".item");
    const item = this.document.items.get(li.dataset.itemId);
    if (item) item.sheet.render(true);
  }

  static _onItemDelete(event, target) {
    const li = target.closest(".item");
    this.document.deleteEmbeddedDocuments("Item", [li.dataset.itemId]);
  }

  static _onItemQuantityPlus(event, target) {
    const item = this.document.items.get(target.dataset.itemid);
    if (item) item.update({ "system.quantity": item.system.quantity + 1 });
  }

  static _onItemQuantityMinus(event, target) {
    const item = this.document.items.get(target.dataset.itemid);
    if (item) item.update({ "system.quantity": item.system.quantity - 1 });
  }

  static _onRollCheck(event, target) {
    const habilidad = target.dataset.habilidad;
    const habilidadValor = foundry.utils.getProperty(
      this.document.system,
      `habilidades.${habilidad}.value`
    );
    const habilidadNombre = foundry.utils.getProperty(
      this.document.system,
      `habilidades.${habilidad}.label`
    );
    // Don't roll if the element is in contenteditable mode
    if (target.getAttribute("contenteditable") === "true") return;
    _onCheckRoll(this.document, habilidadValor, habilidadNombre);
  }

  static _onRollInit(event, target) {
    _onInitRoll(this.document);
  }

  static _onRollAttack(event, target) {
    const weapon = this.document.items.get(target.dataset.itemid)?.system;
    if (weapon) _onAttackRoll(this.document, weapon);
  }

  static _onRollStatus(event, target) {
    const status = target.dataset.status;
    _onStatusRoll(this.document, status);
  }

  static _onHabilidadEdit(event, target) {
    const labelEl = target.nextElementSibling;
    if (!labelEl) return;
    const isEditable = labelEl.getAttribute("contenteditable");
    if (isEditable === "false" || !isEditable) {
      labelEl.setAttribute("contenteditable", "true");
      labelEl.classList.remove("rollable-check");
    } else {
      labelEl.setAttribute("contenteditable", "false");
      labelEl.classList.add("rollable-check");
    }
  }

  static _onItemToggle(event, target) {
    const armor = this.document.items.get(target.dataset.itemid);
    if (armor) {
      armor.update({ "system.equipped": !armor.system.equipped });
      this.document._calculateRD(this.document);
    }
  }

  static _onHealthInc(event, target) {
    const sys = this.document.system;
    if (sys.resistencia.consolidated >= sys.resistencia.max) return;
    if (sys.resistencia.value >= sys.resistencia.max) {
      this.document.update({
        "system.resistencia.consolidated": sys.resistencia.consolidated + 1,
      });
      return;
    }
    this.document.update({
      "system.resistencia.value": sys.resistencia.value + 1,
    });
  }

  static _onHealthDec(event, target) {
    const sys = this.document.system;
    if (sys.resistencia.value <= sys.resistencia.consolidated) return;
    if (sys.resistencia.value === 0) return;
    this.document.update({
      "system.resistencia.value": sys.resistencia.value - 1,
    });
  }

  static _onMentalInc(event, target) {
    const sys = this.document.system;
    if (sys.estabilidadMental.consolidated >= sys.estabilidadMental.max) return;
    if (sys.estabilidadMental.value >= sys.estabilidadMental.max) {
      this.document.update({
        "system.estabilidadMental.consolidated":
          sys.estabilidadMental.consolidated + 1,
      });
      return;
    }
    this.document.update({
      "system.estabilidadMental.value": sys.estabilidadMental.value + 1,
    });
  }

  static _onMentalDec(event, target) {
    const sys = this.document.system;
    if (sys.estabilidadMental.value <= sys.estabilidadMental.consolidated) return;
    if (sys.estabilidadMental.value === 0) return;
    this.document.update({
      "system.estabilidadMental.value": sys.estabilidadMental.value - 1,
    });
  }

  /* -------------------------------------------- */
  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} context The context to prepare.
   * @return {undefined}
   */
  _prepareCharacterItems(context) {
    const gear = [];
    const armor = [];
    const weapon = [];

    for (const item of context.items) {
      item.img = item.img || CONST.DEFAULT_TOKEN;
      if (item.type === "item") gear.push(item);
      else if (item.type === "armor") armor.push(item);
      else if (item.type === "weapon") weapon.push(item);
    }

    context.actor.gear = gear;
    context.actor.armor = armor;
    context.actor.weapon = weapon;
  }
}
