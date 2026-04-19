export function addChatListeners(html) {
  // html may be a jQuery object or native element; handle both for v14 compat
  const el = html instanceof HTMLElement ? html : html[0] ?? html;
  el.querySelectorAll(".drama-roll").forEach((btn) => {
    btn.addEventListener("click", onDramaRoll);
  });
}

function sumDuplicate(arr) {
  const map = arr.reduce((acc, val) => {
    if (acc.has(val)) {
      acc.set(val, acc.get(val) + 1);
    } else {
      acc.set(val, 1);
    }
    return acc;
  }, new Map());
  return Array.from(map, (el) => el[0] * el[1]);
}

function negDuplicate(arr) {
  const map = arr.reduce((acc, val) => {
    if (acc.has(val)) {
      acc.set(val, acc.get(val) + 1);
    } else {
      acc.set(val, 1);
    }
    return acc;
  }, new Map());
  return Array.from(map, (el) => (el[1] > 1 ? el[0] * -1 : el[0]));
}

function calculateDamage(weaponDamage, weaponKindBonus, diceValues) {
  let lookup = {
    m: Number(diceValues[0]),
    C: Number(diceValues[1]),
    M: Number(diceValues[2]),
  };

  let damageBase = eval(
    weaponDamage
      .replace("m", "+" + lookup["m"])
      .replace("C", "+" + lookup["C"])
      .replace("M", "+" + lookup["M"])
  );
  let criticalMod = diceValues.filter((value) => value == 10).length;
  criticalMod = criticalMod > 1 ? criticalMod : 1;
  let damageTotal =
    (Number(damageBase) + Number(weaponKindBonus)) * Number(criticalMod);
  return damageTotal;
}

async function onDramaRoll(event) {
  let mods = Number(event.currentTarget.dataset.mods);
  let modsTooltip = event.currentTarget.dataset.modstooltip.split(",");
  let dicesOld = event.currentTarget.dataset.roll.split(",");
  let actor = game.actors.get(event.currentTarget.dataset.actor);
  let weaponDamage = event.currentTarget.dataset.weapondamage;
  let weaponKindBonus = event.currentTarget.dataset.weaponkindbonus;
  let template = "systems/hitos/templates/chat/roll-drama.html";
  let dialogData = {
    formula: "",
    data: actor.system,
    dices: dicesOld,
    config: CONFIG.hitos,
  };

  let htmlContent = await renderTemplate(template, dialogData);

  await foundry.applications.api.DialogV2.prompt({
    window: { title: "Tirada" },
    content: htmlContent,
    ok: {
      label: game.i18n.localize("Hitos.Roll.Tirar"),
      callback: async (event, button, dialog) => {
        const form = dialog.querySelector("form") ?? dialog;
        let selectedDices = form.querySelectorAll(".check-dice:checked");
        let afectar = form.querySelector(".check-affect:checked")?.value;
        let dicesNew = [];
        selectedDices.forEach((dice) => {
          dicesNew.push(Number(dice.value));
        });
        let newRoll = await new Roll(
          3 - Number(dicesNew.length) + "d10"
        ).evaluate();
        newRoll.terms[0].results.forEach((result) => {
          dicesNew.push(result.result);
        });
        let result;
        if (afectar === "1") {
          result = Math.max(...sumDuplicate(dicesNew)) + mods;
        } else {
          result = Math.min(...negDuplicate(dicesNew)) + mods;
        }
        let damage = calculateDamage(
          weaponDamage,
          weaponKindBonus,
          dicesNew.sort((a, b) => a - b)
        );
        let chatTemplate = "systems/hitos/templates/chat/chat-drama.html";
        let chatData = {
          title: game.i18n.localize("Drama"),
          total: result,
          damage: damage,
          dicesOld: dicesOld,
          dices: dicesNew.sort((a, b) => a - b),
          actor: actor.id,
          mods: mods,
          modsTooltip: modsTooltip,
          weaponDamage: weaponDamage,
          weaponKindBonus: weaponKindBonus,
          data: actor.system,
          config: CONFIG.hitos,
        };
        let html = await renderTemplate(chatTemplate, chatData);
        ChatMessage.create({
          content: html,
          speaker: { alias: actor.name },
          rolls: [newRoll],
          rollMode: game.settings.get("core", "rollMode"),
        });
      },
    },
  });
}
