let stats = [];
let statChangeHistory = [];

document.addEventListener("click", function (e) {
  if (e.target.id === "add-player-btn") {
    handleAddPlayerBtnClick();
  } else if (e.target.dataset.twoPointMiss) {
    handleStatChange(e.target.dataset.twoPointMiss, "twoPtMiss");
  } else if (e.target.dataset.twoPointMake) {
    handleStatChange(e.target.dataset.twoPointMake, "twoPtMake");
  } else if (e.target.dataset.threePointMiss) {
    handleStatChange(e.target.dataset.threePointMiss, "threePtMiss");
  } else if (e.target.dataset.threePointMake) {
    handleStatChange(e.target.dataset.threePointMake, "threePtMake");
  } else if (e.target.dataset.rebound) {
    handleStatChange(e.target.dataset.rebound, "rebound");
  } else if (e.target.dataset.assist) {
    handleStatChange(e.target.dataset.assist, "assist");
  } else if (e.target.dataset.steal) {
    handleStatChange(e.target.dataset.steal, "steal");
  } else if (e.target.dataset.block) {
    handleStatChange(e.target.dataset.block, "block");
  } else if (e.target.dataset.turnover) {
    handleStatChange(e.target.dataset.turnover, "turnover");
  } else if (e.target.id === "reset-stats-btn") {
    handleResetStats();
  } else if (e.target.id === "stat-undo-btn") {
    handleStatUndo();
  }
});

function handleAddPlayerBtnClick() {
  const playerNameEl = document.getElementById("player-name");
  stats.push({
    name: playerNameEl.value,
    FGM: 0,
    FGA: 0,
    TPM: 0,
    TPA: 0,
    REB: 0,
    AST: 0,
    STL: 0,
    BLK: 0,
    TO: 0,
  });
  renderStatBtns();
  renderTable();
  playerNameEl.value = "";
}

function handleStatChange(name, statChange) {
  const targetPlayerObj = stats.filter(function (player) {
    return player.name === name;
  })[0];

  switch (statChange) {
    case "twoPtMiss":
      targetPlayerObj.FGA++;
      break;
    case "twoPtMake":
      targetPlayerObj.FGA++;
      targetPlayerObj.FGM++;
      break;
    case "threePtMiss":
      targetPlayerObj.TPA++;
      targetPlayerObj.FGA++;
      break;
    case "threePtMake":
      targetPlayerObj.FGA++;
      targetPlayerObj.FGM++;
      targetPlayerObj.TPA++;
      targetPlayerObj.TPM++;
      break;
    case "rebound":
      targetPlayerObj.REB++;
      break;
    case "assist":
      targetPlayerObj.AST++;
      break;
    case "steal":
      targetPlayerObj.STL++;
      break;
    case "block":
      targetPlayerObj.BLK++;
      break;
    case "turnover":
      targetPlayerObj.TO++;
      break;
  }

  statChangeHistory.push({
    name: name,
    statChange: statChange,
  });

  renderTable();
  renderStatChangeList();
}

function handleResetStats() {
  if (confirm("Are you sure you want to reset all stats?") == true) {
    stats.forEach(function (player) {
      player.FGA = 0;
      player.FGM = 0;
      player.TPA = 0;
      player.TPM = 0;
      player.REB = 0;
      player.AST = 0;
      player.STL = 0;
      player.BLK = 0;
      player.TO = 0;
    });
    statChangeHistory = [];
    renderTable();
    renderStatChangeList();
  }
}

function handleStatUndo() {
  const lastChange = statChangeHistory.pop();
  const statChange = lastChange.statChange;
  const targetPlayerObj = stats.filter(function (player) {
    return player.name === lastChange.name;
  })[0];
  switch (statChange) {
    case "twoPtMiss":
      targetPlayerObj.FGA--;
      break;
    case "twoPtMake":
      targetPlayerObj.FGA--;
      targetPlayerObj.FGM--;
      break;
    case "threePtMiss":
      targetPlayerObj.TPA--;
      targetPlayerObj.FGA--;
      break;
    case "threePtMake":
      targetPlayerObj.FGA--;
      targetPlayerObj.FGM--;
      targetPlayerObj.TPA--;
      targetPlayerObj.TPM--;
      break;
    case "rebound":
      targetPlayerObj.REB--;
      break;
    case "assist":
      targetPlayerObj.AST--;
      break;
    case "steal":
      targetPlayerObj.STL--;
      break;
    case "block":
      targetPlayerObj.BLK--;
      break;
    case "turnover":
      targetPlayerObj.TO--;
      break;
  }

  renderTable();
  renderStatChangeList();
}

function getStatBtnsHTML() {
  let statBtnsHTML = ``;

  stats.forEach(function (player) {
    statBtnsHTML += `
        <div class="player-stat-btns">
            <p>${player.name}</p>
            <button data-two-point-miss="${player.name}">2Pt Miss</button>
            <button data-two-point-make="${player.name}">2Pt Make</button>
            <button data-three-point-miss="${player.name}">3Pt Miss</button>
            <button data-three-point-make="${player.name}">3Pt Make</button>
            <button data-rebound="${player.name}">REB</button>
            <button data-assist="${player.name}">AST</button>
            <button data-steal="${player.name}">STL</button>
            <button data-block="${player.name}">BLK</button>
            <button data-turnover="${player.name}">TO</button>
        </div>
        `;
  });

  return statBtnsHTML;
}

function renderStatBtns() {
  document.getElementById("stat-btns-container").innerHTML = getStatBtnsHTML();
}

function getTableHTML() {
  let tableHTML = `
    <tr>
    <th>Player</th>
    <th>FGM</th>
    <th>FGA</th>
    <th>FG%</th>
    <th>3PM</th>
    <th>3PA</th>
    <th>3P%</th>
    <th>REB</th>
    <th>AST</th>
    <th>STL</th>
    <th>BLK</th>
    <th>TO</th>
    <th>PTS</th>
    <th>TS%</th>
    </tr>
    `;

  stats.forEach(function (player) {
    tableHTML += `
            <tr>
            <td>${player.name}</td>
            <td>${player.FGM}</td>
            <td>${player.FGA}</td>
            <td>${Math.round((player.FGM * 10000) / player.FGA) / 100}%</td>
            <td>${player.TPM}</td>
            <td>${player.TPA}</td>
            <td>${Math.round((player.TPM * 10000) / player.TPA) / 100}%</td>
            <td>${player.REB}</td>
            <td>${player.AST}</td>
            <td>${player.STL}</td>
            <td>${player.BLK}</td>
            <td>${player.TO}</td>
            <td>${player.FGM * 2 + player.TPM}</td>
            <td>${
              Math.round(
                ((player.FGM * 2 + player.TPM) * 10000) / (2 * player.FGA)
              ) / 100
            }%</td>
            </tr>
            `;
  });
  return tableHTML;
}

function renderTable() {
  document.getElementById("stats-table").innerHTML = getTableHTML();
}

function getStatChangeListHTML() {
  let statChangeHistoryHTML = ``;

  for (let i = statChangeHistory.length - 1; i >= 0; i--) {
    const change = statChangeHistory[i];
    statChangeHistoryHTML += `
            <li>${change.name}: ${change.statChange}</li>
        `;
  }

  return statChangeHistoryHTML;
}

function renderStatChangeList() {
  document.getElementById("stat-change-list").innerHTML =
    getStatChangeListHTML();
}

renderTable();
