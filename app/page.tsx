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

const VEGETAGBLES_EMOJI_MAP: Record<string, string> = {
  carottes: "🥕",
  champignons: "🍄‍🟫",
  avocat: "🥑",
};

const formatKey = (str: string): string => str.split(" ").pop() || "";

export default function Home() {
  const [prices, setPrices] = useState(() => {
    const initialPrices: Record<string, number> = {};
    Object.keys(parsedRules)
      .filter((key) => key.includes("prix . "))
      .forEach((key) => {
        const vegetable = formatKey(key);
        initialPrices[vegetable] = parseInt(parsedRules[key]);
      });
    return initialPrices;
  });

  const [primeurDepenses, setPrimeurDepenses] = useState(
    engine.evaluate("dépenses primeur")
  );

  const updatePrice = (vegetable: string, newPrice: number) => {
    const newPrices = { ...prices };
    newPrices[vegetable] = newPrice;
    setPrices(newPrices);

    engine.setSituation({
      [`prix . ${vegetable}`]: newPrice,
    });
    setPrimeurDepenses(engine.evaluate("dépenses primeur"));
  };

  const getPrices = Object.keys(parsedRules).filter((key) =>
    key.includes("prix . ")
  );

  return (
    <div className="card">
      <h1>🥑🥕🍄‍🟫</h1>
      <h2>Prix de la semaine</h2>
      <ul className="vegetables_list">
        {getPrices.map((p) => {
          const vegetable = formatKey(p);
          return (
            <li key={vegetable} className="vegetable_item">
              <label>
                {VEGETAGBLES_EMOJI_MAP[vegetable]} {vegetable}
              </label>
              <input
                type="number"
                value={prices[vegetable]}
                onChange={(e) => updatePrice(vegetable, e.target.value)}
                style={{
                  width: "80px",
                  marginLeft: "1rem",
                  float: "inline-end",
                }}
              />
              <span>€/kg</span>
            </li>
          );
        })}
      </ul>
      <h2>Coût du panier : {formatValue(primeurDepenses)}</h2>
    </div>
  );
}
