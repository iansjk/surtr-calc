import { useState, useMemo } from "react";
import { sprintf } from "sprintf-js";

function App() {
  const [pulls, setPulls] = useState(0);
  const [pity, setPity] = useState(0);

  const surtrSubrate = 0.5;

  const finalOdds = useMemo(() => {
    let probabilities = Array(99)
      .fill(0)
      .map(() => Array(7).fill(0));
    probabilities[pity][0] = 1;
    for (let a = 0; a < pulls; a++) {
      const newProbabilities = Array(99)
        .fill(0)
        .map(() => Array(7).fill(0));
      for (let i = 0; i < 99; i++) {
        const sixStarChance = i <= 49 ? 0.02 : 0.02 * (i - 48);
        for (let j = 0; j < 7; j++) {
          newProbabilities[Math.min(i + 1, 98)][j] +=
            probabilities[i][j] * (1 - sixStarChance);
          newProbabilities[0][j] +=
            probabilities[i][j] * sixStarChance * (1 - surtrSubrate);
          newProbabilities[0][Math.min(j + 1, 6)] +=
            probabilities[i][j] * sixStarChance * surtrSubrate;
        }
      }
      probabilities = newProbabilities;
    }
    const finalOdds = Array(7).fill(0);
    for (let i = 0; i < 99; i++) {
      for (let j = 0; j < 7; j++) {
        finalOdds[j] += probabilities[i][j];
      }
    }
    return finalOdds;
  }, [pity, pulls]);

  const toPercentage = (p: number) => {
    return `${sprintf("%.4g", p * 100)}%`;
  };

  return (
    <div className="App">
      <label>
        Number of pulls:{" "}
        <input
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const toNumber = parseInt(e.target.value, 10);
            if (!Number.isNaN(toNumber)) {
              setPulls(toNumber);
            }
          }}
          defaultValue={pulls}
        />
      </label>
      <br />
      <label>
        Initial pity:{" "}
        <input
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const toNumber = parseInt(e.target.value, 10);
            if (!Number.isNaN(toNumber) && toNumber < 99) {
              setPity(toNumber);
            }
          }}
          defaultValue={pity}
        />
      </label>

      <ul>
        {[...Array(7).keys()].map((i) => (
          <li key={i}>{`P[${i} surtrs] = ${toPercentage(finalOdds[i])}`}</li>
        ))}
        <br />
        <li>{`P[at least 1 surtr] = ${toPercentage(1 - finalOdds[0])}`}</li>
      </ul>
    </div>
  );
}

export default App;
