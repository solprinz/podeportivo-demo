import { esc, $, money, hsf, calc } from "./state.js";

export function viewSemana(S) {
  const w = S.weeks.find((x) => x.id === S.cur) || S.weeks[0],
    R = calc(S, w);
  const months = ["Diciembre", "Enero", "Febrero", "Marzo"];
  if (!months.includes(S.mf)) S.mf = "Diciembre";

  const weeksOfCurrentMonth = S.weeks.filter((x) => x.month === S.mf);
  if (!weeksOfCurrentMonth.find((x) => x.id === w.id))
    S.cur = weeksOfCurrentMonth[0]?.id || S.weeks[0].id;
  const currentActiveWeek = S.weeks.find((x) => x.id === S.cur) || w;
  const firstDay = currentActiveWeek.days[0]?.label.replace(/<br>/g, " ") || "";
  const lastDay =
    currentActiveWeek.days[currentActiveWeek.days.length - 1]?.label.replace(
      /<br>/g,
      " ",
    ) || "";
  const isClosed = currentActiveWeek.closed;

  const opts = (sel) =>
    '<option value=""></option>' +
    ["P", "E"]
      .map(
        (t) =>
          `<optgroup label="${t == "P" ? "Profesores y guardavidas" : "Estudiantes"}">` +
          [...S.staff]
            .sort((a, b) => a.name.localeCompare(b.name, "es"))
            .filter((p) => p.type === t)
            .map(
              (p) =>
                `<option value="${p.id}"${p.id == sel ? " selected" : ""}>${esc(p.name)}</option>`,
            )
            .join("") +
          "</optgroup>",
      )
      .join("");

  let h = `<div class="chip-section noprint">
    <div class="mu" style="margin-bottom:4px;font-weight:600">SELECCIONAR MES:</div>
    <div class="chip-container">${months.map((m) => `<button class="chip ${S.mf == m ? "active" : ""}" data-a="selectMonth" data-m="${m}">${m}</button>`).join("")}</div>
    <div class="mu" style="margin-bottom:4px;margin-top:12px;font-weight:600">SEMANAS DE ${S.mf.toUpperCase()}:</div>
    <div class="chip-container">${weeksOfCurrentMonth.map((wItem) => `<button class="chip ${wItem.id == currentActiveWeek.id ? "active" : ""}" data-a="selectWeek" data-id="${wItem.id}">${esc(wItem.name)} ${wItem.closed ? "🔒" : ""}</button>`).join("")}</div>
  </div>`;

  h += `<div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
    <div>
      <div class="big-title">Horarios de la semana: Del ${firstDay} al ${lastDay}</div>
      <div class="mu">${isClosed ? '<span style="color:var(--bad); font-weight:700">🔒 Semana Cerrada y Bloqueada (Liquidación Congelada)</span>' : "Marcá “Finde / feriado” en fines de semana y feriados (como 24 y 31) para usar la tarifa de finde. ☔ = llueve o se cancela el turno."}</div>
    </div>
    <div class="noprint">
      <button data-a="toggleClose" class="${isClosed ? "" : "pri"}" style="${isClosed ? "background:#b91c1c; color:#fff;" : ""}">
        ${isClosed ? "🔓 Abrir / Desbloquear Semana" : "🔒 Cerrar y Congelar Semana"}
      </button>
    </div>
  </div>`;

  h += `<div class="card"><div class="sc"><table class="grid"><thead><tr><th>Turno</th>`;

  currentActiveWeek.days.forEach(
    (d, i) =>
      (h += `<th class="${d.we ? "we" : ""}"><div style="font-weight:600;padding:4px 0">${d.label}</div>
   <label class="mu"><input type="checkbox" data-a="dwe" data-i="${i}"${d.we ? " checked" : ""}${isClosed ? " disabled" : ""}> Finde / feriado</label>
   ${
     !isClosed
       ? `<div class="noprint" style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap">
     <button data-a="drain" data-i="${i}">☔ Llueve</button>
     <button data-a="clearday" data-i="${i}" class="x" title="Limpiar todo este día">Limpiar</button>
   </div>`
       : ""
   }</th>`),
  );
  h += "</tr></thead><tbody>";

  S.turnos.forEach((s, si) => {
    h += `<tr><td class="sh"><b>${esc(s.name)}</b><div class="mu">${hsf(s.hs)} hs sem · ${hsf(s.hsWe)} hs finde</div></td>`;
    currentActiveWeek.days.forEach((d, di) => {
      const k = di + "_" + si,
        c = currentActiveWeek.cells[k] || { slots: ["", ""], rain: false };
      h += `<td class="${c.rain ? "rain " : ""}${d.we ? "we" : ""}"><div class="mu">${esc(d.we ? s.labelWe : s.label)} · ${hsf($(d.we ? s.hsWe : s.hs))} hs</div>`;
      c.slots.forEach(
        (id, j) =>
          (h += `<select data-a="slot" data-k="${k}" data-j="${j}"${isClosed ? " disabled" : ""}>${opts(id)}</select>`),
      );
      if (!isClosed) {
        h += `<div class="noprint"><label><input type="checkbox" data-a="crain" data-k="${k}"${c.rain ? " checked" : ""}> ☔ Lluvia turno</label></div>`;
      }
      h += `</td>`;
    });
    h += "</tr>";
  });

  h += "</tbody></table></div></div>";

  h += `<div class="card"><h2>Liquidación de la semana: Del ${firstDay} al ${lastDay}</h2><div class="sc"><table class="liq-table"><thead><tr>
    <th class="col-name">Nombre</th>
    <th class="n col-wk">Horas Semana</th>
    <th class="n col-wk">Total Semana</th>
    <th class="n col-we">Horas Finde</th>
    <th class="n col-we">Total Finde</th>
    <th class="n col-rain">Horas con lluvia</th>
    <th class="n col-tot">TOTAL</th>
  </tr></thead><tbody>`;
  let tot = 0;
  ["P", "E"].forEach((t) => {
    h += `<tr class="sep"><td colspan="7">${t == "P" ? "PROFESORES Y GUARDAVIDAS" : "ESTUDIANTES"}</td></tr>`;
    [...S.staff]
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .filter((p) => p.type === t)
      .forEach((p) => {
        const r = R[p.id] || {
          hw: 0,
          hwe: 0,
          hr: 0,
          mw: 0,
          mwe: 0,
          total: 0,
        };
        tot += r.total;
        h += `<tr>
          <td class="col-name">${esc(p.name)}</td>
          <td class="n col-wk">${hsf(r.hw)}</td>
          <td class="n col-wk">${money(r.mw)}</td>
          <td class="n col-we">${hsf(r.hwe)}</td>
          <td class="n col-we">${money(r.mwe)}</td>
          <td class="n col-rain">${hsf(r.hr)}</td>
          <td class="n col-tot"><b>${money(r.total)}</b></td>
        </tr>`;
      });
  });
  h += `</tbody><tfoot><tr>
    <td colspan="6" class="n">TOTAL</td>
    <td class="n liq-grand-total">${money(tot)}</td>
  </tr></tfoot></table></div></div>`;
  return h;
}

export function viewGrupo(S) {
  const w = S.weeks.find((x) => x.id === S.cur) || S.weeks[0];
  const months = ["Diciembre", "Enero", "Febrero", "Marzo"];
  if (!months.includes(S.mf)) S.mf = "Diciembre";
  const weeksOfCurrentMonth = S.weeks.filter((x) => x.month === S.mf);
  if (!weeksOfCurrentMonth.find((x) => x.id === w.id))
    S.cur = weeksOfCurrentMonth[0]?.id || S.weeks[0].id;
  const currentActiveWeek = S.weeks.find((x) => x.id === S.cur) || w;

  const personName = (id) => {
    const p = S.staff.find((x) => x.id === id);
    return p ? p.name : "—";
  };

  let h = `<div class="chip-section noprint">
    <div class="mu" style="margin-bottom:4px;font-weight:600">SELECCIONAR MES:</div>
    <div class="chip-container">${months.map((m) => `<button class="chip ${S.mf == m ? "active" : ""}" data-a="selectMonth" data-m="${m}">${m}</button>`).join("")}</div>
    <div class="mu" style="margin-bottom:4px;margin-top:12px;font-weight:600">SEMANAS DE ${S.mf.toUpperCase()}:</div>
    <div class="chip-container">${weeksOfCurrentMonth.map((wItem) => `<button class="chip ${wItem.id == currentActiveWeek.id ? "active" : ""}" data-a="selectWeek" data-id="${wItem.id}">${esc(wItem.name)} ${wItem.closed ? "🔒" : ""}</button>`).join("")}</div>
  </div>`;

  h += `<div class="group-view-card">
    <div class="group-header-banner">POLIDEPORTIVO — CRONOGRAMA ${currentActiveWeek.name.toUpperCase()} (${currentActiveWeek.month.toUpperCase()}) ${currentActiveWeek.closed ? "[CERRADO]" : ""}</div>
    <div class="group-subtitle">🏊TURNOS PILETA</div>
    <div class="sc"><table class="excel-table"><thead><tr><th>Turno / Horario</th>`;

  currentActiveWeek.days.forEach(
    (d) => (h += `<th class="${d.we ? "weekend-th" : ""}">${d.label}</th>`),
  );
  h += `</tr></thead><tbody>`;

  S.turnos.forEach((s, si) => {
    h += `<tr><td class="label-td"><b>${esc(s.name)}</b><br><span class="mu">Sem: ${s.label}<br>Finde: ${s.labelWe}</span></td>`;
    currentActiveWeek.days.forEach((d, di) => {
      const k = di + "_" + si,
        c = currentActiveWeek.cells[k];
      let names = "—";
      if (c && c.slots && c.slots.some((id) => id)) {
        names = c.slots
          .map((id) => (id ? personName(id) : ""))
          .filter(Boolean)
          .join("<br>");
        if (c.rain)
          names += '<br><span style="color:var(--bad)">☔ (Lluvia)</span>';
      }
      const tdClass = c && c.rain ? "rain-turn" : d.we ? "we-turn" : "wk-turn";
      h += `<td class="${tdClass}">${names}</td>`;
    });
    h += `</tr>`;
  });
  h += `</tbody></table></div></div>`;
  return h;
}

export function viewPersonal(S) {
  let h = `<div class="card"><h2>Personal</h2><div class="row noprint"><input type="text" id="np" placeholder="Nombre y apellido"><select id="nt"><option value="P">Profesor / Guardavidas</option><option value="E">Estudiante</option></select><button class="pri" data-a="addp">Agregar</button></div>
  <div class="sc"><table><thead><tr><th>Nombre y Apellido</th><th>Tipo</th><th></th></tr></thead><tbody>`;
  [...S.staff]
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .forEach(
      (p) =>
        (h += `<tr><td><input type="text" style="width:100%" data-a="pname" data-id="${p.id}" value="${esc(p.name)}"></td><td><select data-a="ptype" data-id="${p.id}"><option value="P"${p.type == "P" ? " selected" : ""}>Profesor / guardavidas</option><option value="E"${p.type == "E" ? " selected" : ""}>Estudiante</option></select></td><td><button class="x" data-a="delp" data-id="${p.id}">Borrar</button></td></tr>`),
    );
  return h + "</tbody></table></div></div>";
}

export function viewConfig(S) {
  const row = (t, n) =>
    `<tr><td>${n}</td>${["wk", "we"].map((f) => `<td><input type="number" step="50" data-a="rate" data-t="${t}" data-f="${f}" value="${S.rates[t][f]}"></td>`).join("")}</tr>`;

  let h = `<div class="card"><h2>Valores por hora</h2><div class="sc"><table style="max-width:650px"><thead><tr><th></th><th>Hora día de semana</th><th>Hora fin de semana</th></tr></thead><tbody>${row("P", "Profesor / guardavidas")}${row("E", "Estudiante")}</tbody></table></div></div>`;

  h += `<div class="card"><h2>Configuración de Lluvia</h2><label>Si llueve se cobra el <input type="number" min="0" max="100" step="5" data-a="rainf" value="${Math.round(S.rain * 100)}"> % del turno</label></div>`;

  h += `<div class="card"><h2>Turnos y duración</h2><div class="mu" style="margin-bottom:10px">Escribí inicio y fin (ej: 14:30 a 17:15 o 13 a 16:30); las horas se calculan solas.</div><div class="sc"><table><thead><tr><th>Turno</th><th>Horario semana</th><th class="n">Horas semana</th><th>Horario finde / feriado</th><th class="n">Horas finde / feriado</th></tr></thead><tbody>`;
  S.turnos.forEach(
    (s, i) =>
      (h += `<tr><td><b>${esc(s.name)}</b></td><td><input type="text" data-a="tcfg" data-i="${i}" data-f="label" value="${esc(s.label)}"></td><td class="n"><b>${hsf(s.hs)} hs</b></td><td><input type="text" data-a="tcfg" data-i="${i}" data-f="labelWe" value="${esc(s.labelWe)}"></td><td class="n"><b>${hsf(s.hsWe)} hs</b></td></tr>`),
  );
  h += "</tbody></table></div></div>";
  return h;
}

export function viewResumen(S) {
  const months = ["Diciembre", "Enero", "Febrero", "Marzo"];
  if (!months.includes(S.mf)) S.mf = "Diciembre";
  const ws = S.weeks.filter((w) => w.month === S.mf),
    Rs = ws.map((w) => calc(S, w));
  let h = `<div class="card"><div class="mu" style="margin-bottom:6px;font-weight:600">SELECCIONAR MES PARA RESUMEN:</div>
    <div class="chip-container" style="margin-bottom:16px">${months.map((m) => `<button class="chip ${S.mf == m ? "active" : ""}" data-a="mf" data-m="${m}">${m}</button>`).join("")}</div>
    <div class="sc"><table><thead><tr><th>Nombre</th>${ws.map((w) => `<th class="n">${esc(w.name)} ${w.closed ? "🔒" : ""}</th>`).join("")}<th class="n">TOTAL</th></tr></thead><tbody>`;
  const col = ws.map(() => 0);
  let g = 0;
  ["P", "E"].forEach((t) => {
    h += `<tr class="sep"><td colspan="${ws.length + 2}">${t == "P" ? "PROFESORES Y GUARDAVIDAS" : "ESTUDIANTES"}</td></tr>`;
    [...S.staff]
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .filter((p) => p.type === t)
      .forEach((p) => {
        let s = 0;
        h += `<tr><td>${esc(p.name)}</td>${Rs.map((R, i) => {
          const v = R[p.id]?.total || 0;
          s += v;
          col[i] += v;
          return `<td class="n">${money(v)}</td>`;
        }).join("")}<td class="n"><b>${money(s)}</b></td></tr>`;
        g += s;
      });
  });
  return (
    h +
    `</tbody><tfoot><tr><td>TOTAL MENSUAL</td>${col.map((v) => `<td class="n">${money(v)}</td>`).join("")}<td class="n grand-total">${money(g)}</td></tr></tfoot></table></div></div>`
  );
}
