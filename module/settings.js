
export function registerSettings() {
  game.settings.register("hitos", "mentalHealthEnabled", {
    name: "Hitos.EnableMentalHealth",
    hint: "Hitos.EnableMentalHealthHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("hitos", "gameModule", {
    name: "Hitos.EnableMentalHealth",
    hint: "Hitos.EnableMentalHealthHint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: String,
    choices: {
      cultos: "Hitos.CultosInnombrables",
      lcdt: "Hitos.LasCorrientesDelTiempo",
      core: "Hitos.Core",
    },
    default: "cultos",
  });
}
