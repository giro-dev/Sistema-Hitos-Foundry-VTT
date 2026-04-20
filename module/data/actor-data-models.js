const fields = foundry.data.fields;

/* -------------------------------------------- */
/*  Reusable Schema Helpers                     */
/* -------------------------------------------- */

function atributoField(label = "") {
  return new fields.SchemaField({
    label: new fields.StringField({ initial: label }),
    concept: new fields.StringField({ initial: "" }),
    value: new fields.NumberField({ initial: 0, integer: true, min: 0, max: 12 }),
    min: new fields.NumberField({ initial: 0, integer: true }),
    max: new fields.NumberField({ initial: 12, integer: true }),
    spent: new fields.BooleanField({ initial: false }),
  });
}

function habilidadField(label = "", gameModule = "core") {
  return new fields.SchemaField({
    label: new fields.StringField({ initial: label }),
    concept: new fields.StringField({ initial: "" }),
    value: new fields.NumberField({ initial: 0, integer: true, min: 0, max: 12 }),
    min: new fields.NumberField({ initial: 0, integer: true }),
    max: new fields.NumberField({ initial: 12, integer: true }),
    spent: new fields.BooleanField({ initial: false }),
    available: new fields.BooleanField({ initial: true }),
    gameModule: new fields.StringField({ initial: gameModule }),
  });
}

function hitoField() {
  return new fields.SchemaField({
    value: new fields.StringField({ initial: "" }),
    spent: new fields.BooleanField({ initial: false }),
  });
}

function adicionalField() {
  return new fields.SchemaField({
    label: new fields.StringField({ initial: "" }),
    value: new fields.NumberField({ initial: 0, integer: true }),
  });
}

/* -------------------------------------------- */
/*  Shared Template Schemas                     */
/* -------------------------------------------- */

function bioSchema() {
  return {
    concepto: new fields.StringField({ initial: "" }),
    biografia: new fields.HTMLField({ initial: "" }),
    descripcion: new fields.HTMLField({ initial: "" }),
    extras: new fields.HTMLField({ initial: "" }),
    cita: new fields.StringField({ initial: "" }),
    drama: new fields.SchemaField({
      value: new fields.NumberField({ initial: 1, integer: true }),
      min: new fields.NumberField({ initial: 0, integer: true }),
      max: new fields.NumberField({ initial: 5, integer: true }),
    }),
  };
}

function combateSchema() {
  return {
    iniciativa: new fields.NumberField({ initial: 0, integer: true }),
    rd: new fields.NumberField({ initial: 0, integer: true }),
    defensa: new fields.SchemaField({
      normal: new fields.NumberField({ initial: 0, integer: true }),
      des: new fields.NumberField({ initial: 0, integer: true }),
    }),
    danio: new fields.SchemaField({
      cuerpo: new fields.NumberField({ initial: 0, integer: true }),
      distancia: new fields.NumberField({ initial: 0, integer: true }),
    }),
  };
}

function adicionalSchema() {
  return {
    campoadicional1: adicionalField(),
    campoadicional2: adicionalField(),
  };
}

function saludSchema() {
  return {
    aguante: new fields.SchemaField({
      label: new fields.StringField({ initial: "Hitos.Aguante" }),
      value: new fields.StringField({ initial: "" }),
    }),
    resistencia: new fields.SchemaField({
      label: new fields.StringField({ initial: "Hitos.HP" }),
      value: new fields.NumberField({ initial: 0, integer: true }),
      max: new fields.NumberField({ initial: 15, integer: true }),
      min: new fields.NumberField({ initial: 0, integer: true }),
      consolidated: new fields.NumberField({ initial: 0, integer: true }),
      status: new fields.StringField({ initial: "" }),
      mod: new fields.NumberField({ initial: 0, integer: true }),
    }),
    secuelas: new fields.SchemaField({
      value: new fields.StringField({ initial: "" }),
    }),
  };
}

function corduraSchema() {
  return {
    estabilidadMental: new fields.SchemaField({
      label: new fields.StringField({ initial: "Hitos.MP" }),
      value: new fields.NumberField({ initial: 0, integer: true }),
      max: new fields.NumberField({ initial: 15, integer: true }),
      min: new fields.NumberField({ initial: 0, integer: true }),
      consolidated: new fields.NumberField({ initial: 0, integer: true }),
      status: new fields.StringField({ initial: "" }),
      mod: new fields.NumberField({ initial: 0, integer: true }),
      degeneracion: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0, integer: true }),
        description: new fields.StringField({ initial: "" }),
      }),
    }),
    entereza: new fields.SchemaField({
      label: new fields.StringField({ initial: "Hitos.Entereza" }),
      value: new fields.StringField({ initial: "" }),
    }),
    transtornos: new fields.SchemaField({
      value: new fields.StringField({ initial: "" }),
    }),
  };
}

function hitosSchema() {
  return {
    hito1: hitoField(),
    hito2: hitoField(),
    hito3: hitoField(),
    hito4: hitoField(),
  };
}

function complicacionSchema() {
  return {
    complicacion: new fields.SchemaField({
      value: new fields.StringField({ initial: "" }),
      spent: new fields.BooleanField({ initial: false }),
    }),
  };
}

function caracteristicasSchema() {
  return {
    atributos: new fields.SchemaField({
      for: atributoField("Hitos.FOR"),
      ref: atributoField("Hitos.REF"),
      vol: atributoField("Hitos.VOL"),
      int: atributoField("Hitos.INT"),
    }),
    habilidades: new fields.SchemaField({
      ffisica: habilidadField("Hitos.FFisica", "core"),
      combate: habilidadField("Hitos.Combate", "core"),
      interaccion: habilidadField("Hitos.Interaccion", "core"),
      percepcion: habilidadField("Hitos.Percepcion", "core"),
      subterfugio: habilidadField("Hitos.Subterfugio", "core"),
      cultura: habilidadField("Hitos.Cultura", "core"),
      profesion: habilidadField("Hitos.Profesion", "core"),
      psiquico: habilidadField("Hitos.Psiquico", "cultos"),
      ocultismo: habilidadField("Hitos.Ocultismo", "cultos"),
      brujeria: habilidadField("Hitos.Brujeria", "cultos"),
      arcanas: habilidadField("Hitos.Arcanas", "cultos"),
      tempodinamica: habilidadField("Hitos.Tempodinamica", "lcdt"),
      adicional1: habilidadField("", "core"),
      adicional2: habilidadField("", "core"),
      adicional3: habilidadField("", "core"),
      adicional4: habilidadField("", "core"),
    }),
  };
}

/* -------------------------------------------- */
/*  Actor Type Data Models                      */
/* -------------------------------------------- */

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...bioSchema(),
      ...combateSchema(),
      ...complicacionSchema(),
      ...hitosSchema(),
      ...saludSchema(),
      ...corduraSchema(),
      ...caracteristicasSchema(),
      ...adicionalSchema(),
    };
  }
}

export class NpcData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...bioSchema(),
      ...caracteristicasSchema(),
      ...combateSchema(),
      ...saludSchema(),
      ...corduraSchema(),
      ...adicionalSchema(),
    };
  }
}

export class VehicleData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...bioSchema(),
      ...hitosSchema(),
      ...adicionalSchema(),
      atributos: new fields.SchemaField({
        est: atributoField("Hitos.EST"),
        tam: atributoField("Hitos.TAM"),
        man: atributoField("Hitos.MAN"),
        tec: atributoField("Hitos.TEC"),
      }),
      caracteristicas: new fields.SchemaField({
        blindaje: new fields.NumberField({ initial: 0, integer: true }),
        defensa: new fields.NumberField({ initial: 0, integer: true }),
        armamento: new fields.NumberField({ initial: 0, integer: true }),
        aguante: new fields.NumberField({ initial: 0, integer: true }),
        resistencais: new fields.NumberField({ initial: 0, integer: true }),
      }),
      especial: new fields.StringField({ initial: "" }),
      tripulantes: new fields.StringField({ initial: "" }),
    };
  }
}

export class OrganizationData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...bioSchema(),
      ...hitosSchema(),
      ...adicionalSchema(),
      motivacion: new fields.StringField({ initial: "" }),
      atributos: new fields.SchemaField({
        rec: atributoField("Hitos.REC"),
        inf: atributoField("Hitos.INF"),
        pod: atributoField("Hitos.POD"),
        tam: atributoField("Hitos.TAM"),
      }),
      notas: new fields.HTMLField({ initial: "" }),
    };
  }
}
