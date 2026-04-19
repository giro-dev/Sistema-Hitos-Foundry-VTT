const fields = foundry.data.fields;

/* -------------------------------------------- */
/*  Item Type Data Models                       */
/* -------------------------------------------- */

export class ItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      price: new fields.StringField({ initial: "" }),
      quantity: new fields.NumberField({ initial: 1, integer: true }),
      weight: new fields.NumberField({ initial: 0 }),
    };
  }
}

export class WeaponData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      price: new fields.StringField({ initial: "" }),
      kind: new fields.StringField({ initial: "" }),
      damage: new fields.StringField({ initial: "" }),
    };
  }
}

export class ArmorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      price: new fields.StringField({ initial: "" }),
      rd: new fields.NumberField({ initial: 0, integer: true }),
      equipped: new fields.BooleanField({ initial: false }),
    };
  }
}
