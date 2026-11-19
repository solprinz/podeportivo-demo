import { auth, db } from "./firebase.js";
import {
  defaults,
  defaultWeeks,
  uid,
  calc,
  calcHoursFromRange,
} from "./state.js";
import {
  viewSemana,
  viewGrupo,
  viewResumen,
  viewPersonal,
  viewConfig,
} from "./views.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

let S = defaults();
let unsub = [];
S.weeks = [];
S.cur = "";
S.mf = "";

const st = (t) => {
  document.getElementById("st").textContent = t;
};
const ok = () => st("✓ Guardado"),
  ko = () => st("⚠ No se pudo guardar");

function saveCfg() {
  const c = {};
  ["staff", "turnos", "rates", "rain"].forEach((k) => (c[k] = S[k]));
  setDoc(doc(db, "config", "general"), c)
    .then(ok)
    .catch(ko);
}
function saveWeek(w) {
  setDoc(doc(db, "semanas", w.id), w)
    .then(ok)
    .catch(ko);
}
function persist(a, w) {
  const LOCAL = ["cur", "mf", "tab", "selectMonth", "selectWeek"];
  if (LOCAL.includes(a)) return;
  const CA = ["pname", "ptype", "rate", "rainf", "tcfg", "addp", "delp"];
  CA.includes(a) ? saveCfg() : saveWeek(w);
}

function start() {
  unsub.push(
    onSnapshot(
      doc(db, "config", "general"),
      (s) => {
        if (!s.exists()) {
          saveCfg();
          return;
        }
        if (s.metadata.hasPendingWrites) return;
        ["staff", "turnos", "rates", "rain"].forEach(
          (k) => (S[k] = s.data()[k]),
        );
        render();
      },
      () => st("⚠ Sin conexión"),
    ),
  );

  unsub.push(
    onSnapshot(
      collection(db, "semanas"),
      (s) => {
        if (s.metadata.hasPendingWrites) return;
        const remoteWeeks = s.docs
          .map((d) => d.data())
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        const defs = defaultWeeks();
        if (!remoteWeeks.length) {
          defs.forEach((w) => saveWeek(w));
          S.weeks = defs;
        } else {
          S.weeks = defs.map(
            (def) => remoteWeeks.find((r) => r.id === def.id) || def,
          );
        }
        if (!S.weeks.find((w) => w.id == S.cur)) S.cur = S.weeks[0].id;
        if (!S.mf) S.mf = "Diciembre";
        st("✓ Sincronizado");
        render();
      },
      () => st("⚠ Sin conexión"),
    ),
  );
}

const week = () => S.weeks.find((w) => w.id === S.cur) || S.weeks[0];
const personObj = (id) => S.staff.find((p) => p.id === id);
const cell = (w, k) =>
  w.cells[k] || (w.cells[k] = { slots: ["", ""], rain: false });

function updateTurnoRange(i, field, val) {
  const turno = S.turnos[i];
  turno[field] = val;
  const hoursField = field === "labelWe" ? "hsWe" : "hs";
  const calculated = calcHoursFromRange(val);
  if (calculated !== null) {
    turno[hoursField] = calculated;
  }
}

function render() {
  if (!S.weeks.length) {
    document.getElementById("app").innerHTML = '<p class="mu">Cargando…</p>';
    return;
  }
  const tabs = [
    ["semana", "Planilla Editable"],
    ["grupo", "HORARIOS SEMANALES"],
    ["resumen", "Resumen mensual"],
    ["personal", "Personal"],
    ["config", "Configuraciones"],
  ];
  document.getElementById("nav").innerHTML = tabs
    .map(
      ([k, n]) =>
        `<button data-a="tab" data-t="${k}" class="${S.tab == k ? "on" : ""}">${n}</button>`,
    )
    .join("");

  const viewsMap = {
    semana: viewSemana,
    grupo: viewGrupo,
    resumen: viewResumen,
    personal: viewPersonal,
    config: viewConfig,
  };
  document.getElementById("app").innerHTML = viewsMap[S.tab](S);
}

document.addEventListener("change", (e) => {
  const t = e.target,
    a = t.dataset.a;
  if (!a) return;
  const w = week(),
    i = +t.dataset.i,
    v = t.type === "checkbox" ? t.checked : t.value;

  const globalMap = {
    tcfg: () => updateTurnoRange(i, t.dataset.f, v),
    pname: () => (personObj(t.dataset.id).name = v),
    ptype: () => (personObj(t.dataset.id).type = v),
    rate: () => (S.rates[t.dataset.t][t.dataset.f] = Number(v) || 0),
    rainf: () => (S.rain = Math.min(100, Math.max(0, Number(v) || 0)) / 100),
    mf: () => (S.mf = v),
  };

  if (globalMap[a]) {
    globalMap[a]();
    render();
    persist(a, w);
    return;
  }

  if (w.closed) return;

  const weekMap = {
    dwe: () => (w.days[i].we = v),
    slot: () => (cell(w, t.dataset.k).slots[+t.dataset.j] = v),
    crain: () => (cell(w, t.dataset.k).rain = v),
  };

  if (weekMap[a]) {
    weekMap[a]();
    render();
    persist(a, w);
  }
});

document.addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  const a = t.dataset.a;
  if (!a) return;
  const w = week(),
    i = +t.dataset.i;

  if (a === "tab") S.tab = t.dataset.t;
  else if (a === "selectMonth") {
    S.mf = t.dataset.m;
    const firstW = S.weeks.find((x) => x.month === S.mf);
    if (firstW) S.cur = firstW.id;
  } else if (a === "selectWeek") S.cur = t.dataset.id;
  else if (a === "mf") S.mf = t.dataset.m;
  else if (a === "toggleClose") {
    if (!w.closed) {
      if (
        confirm(
          "¿Cerrar y congelar los sueldos de esta semana? Ya no se podrá editar y los cambios de tarifas futuros no la afectarán.",
        )
      ) {
        w.closed = true;
        w.snapshot = calc(S, w);
      }
    } else {
      if (
        confirm("¿Deseas desbloquear esta semana para permitir modificaciones?")
      ) {
        w.closed = false;
        w.snapshot = null;
      }
    }
  } else if (a === "addp") {
    const n = document.getElementById("np").value.trim();
    if (!n) return;
    S.staff.push({
      id: uid(),
      name: n,
      type: document.getElementById("nt").value,
    });
  } else if (a === "delp") {
    if (!confirm("¿Borrar a esta persona?")) return;
    S.staff = S.staff.filter((p) => p.id != t.dataset.id);
  } else if (!w.closed) {
    if (a === "drain") {
      const on = !S.turnos.every((s, si) => cell(w, i + "_" + si).rain);
      S.turnos.forEach((s, si) => (cell(w, i + "_" + si).rain = on));
    } else if (a === "clearday") {
      if (confirm("¿Limpiar todos los turnos de este día?")) {
        S.turnos.forEach((_, si) => {
          const k = i + "_" + si;
          if (w.cells[k]) w.cells[k].slots = ["", ""];
        });
      }
    }
  }

  if (a === "export") {
    const b = new Blob([JSON.stringify(S)], { type: "application/json" }),
      l = document.createElement("a");
    l.href = URL.createObjectURL(b);
    l.download = "planilla-poli.json";
    l.click();
    return;
  } else if (a === "logout") {
    signOut(auth);
    return;
  } else if (a === "print") {
    window.print();
    return;
  }

  render();
  persist(a, w);
});

render();
onAuthStateChanged(auth, (u) => {
  document.getElementById("login").hidden = !!u;
  unsub.forEach((f) => f());
  unsub = [];
  S.weeks = [];
  S.cur = "";
  render();
  if (u) start();
});

document.getElementById("lf").addEventListener("submit", (e) => {
  e.preventDefault();
  signInWithEmailAndPassword(
    auth,
    document.getElementById("em").value,
    document.getElementById("pw").value,
  ).catch(() => {
    document.getElementById("le").textContent =
      "Email o contraseña incorrectos";
  });
});
