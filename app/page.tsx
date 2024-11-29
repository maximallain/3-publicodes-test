"use client";
import Engine, { formatValue } from "publicodes";
import { parse } from "yaml";
import { useState } from "react";

const rules = `
prix:
prix . carottes: 2€/kg
prix . champignons: 5€/kg
prix . avocat: 2€/avocat

dépenses primeur:
  formule:
    somme:
      - prix . carottes * 1.5 kg
      - prix . champignons * 500g
      - prix . avocat * 3 avocat
`;
const parsedRules = parse(rules);
console.log("parsedRules", parsedRules);
export const engine = new Engine(parsedRules);
console.log("engine", engine);
const depensesParJour = engine.evaluate("dépenses primeur / 7 jours");
console.log(`J'ai dépensé ${formatValue(depensesParJour)}.`);
const depensesParMois = engine.evaluate({
  valeur: "dépenses primeur / 7 jours",
  unité: "€/mois",
});
console.log("depensesParMois", depensesParMois);
// const primeurDepenses = engine.evaluate("dépenses primeur");

export default function Home() {
  const [primeurDepenses, setPrimeurDepenses] = useState(
    engine.evaluate("dépenses primeur")
  );
  const changeLePrixDeLAvocat = () => {
    engine.setSituation({
      "prix . avocat": "3€/avocat",
    });
    setPrimeurDepenses(engine.evaluate("dépenses primeur"));
  };

  return (
    <div className="card">
      <h1>🥑🥕🍄‍🟫</h1>
      {/* <h2>Prix de la semaine</h2> */}
      {/* {engine.publicParsedRules.map((rule) => rule.title)} */}
      <h2>Coût du panier : {formatValue(primeurDepenses)}</h2>
      <button onClick={changeLePrixDeLAvocat}>
        Changer le prix de l'avocat (2€ =&gt; 3€)
      </button>
    </div>
  );
}
