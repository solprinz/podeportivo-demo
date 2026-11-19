export const uid = () => Math.random().toString(36).slice(2, 9);
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
export const $ = (n) => Number(n) || 0;
export const money = (n) => "$ " + Math.round(n).toLocaleString("es-AR");
export const hsf = (n) => (Math.round(n * 100) / 100).toLocaleString("es-AR");

function parseTimeToMinutes(str) {
  const m = String(str || "")
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return null;
  const h = Number(m[1]),
    min = Number(m[2] || 0);
  if (h > 24 || min >= 60) return null;
  return h * 60 + min;
}

export function calcHoursFromRange(rangeStr) {
  const parts = String(rangeStr || "").split(/\s*(?:a|-|–|—|to)\s*/i);
  if (parts.length < 2) return null;
  const start = parseTimeToMinutes(parts[0]);
  const end = parseTimeToMinutes(parts[1]);
  if (start === null || end === null) return null;
  let diffMin = end - start;
  if (diffMin < 0) diffMin += 24 * 60;
  return Math.round((diffMin / 60) * 100) / 100;
}

export const TURNOS = () => [
  {
    name: "Primer turno",
    label: "14:30 a 17:15",
    hs: 2.75,
    labelWe: "13 a 16:30",
    hsWe: 3.5,
  },
  {
    name: "Refuerzo",
    label: "15:30 a 19:30",
    hs: 4,
    labelWe: "15 a 19",
    hsWe: 4,
  },
  {
    name: "Segundo turno",
    label: "17:15 a 20",
    hs: 2.75,
    labelWe: "16:30 a 20",
    hsWe: 3.5,
  },
];

export function defaultWeeks() {
  const list = [
    {
      id: "dic_1",
      name: "Semana 1",
      month: "Diciembre",
      order: 1,
      closed: false,
      days: [
        { label: "Lunes 30 Nov", we: false },
        { label: "Martes 1 Dic", we: false },
        { label: "Miércoles 2", we: false },
        { label: "Jueves 3", we: false },
        { label: "Viernes 4", we: false },
        { label: "Sábado 5", we: true },
        { label: "Domingo 6", we: true },
      ],
    },
    {
      id: "dic_2",
      name: "Semana 2",
      month: "Diciembre",
      order: 2,
      closed: false,
      days: [
        { label: "Lunes 7", we: false },
        { label: "Martes 8 <br>(Feriado)", we: true },
        { label: "Miércoles 9", we: false },
        { label: "Jueves 10", we: false },
        { label: "Viernes 11", we: false },
        { label: "Sábado 12", we: true },
        { label: "Domingo 13", we: true },
      ],
    },
    {
      id: "dic_3",
      name: "Semana 3",
      month: "Diciembre",
      order: 3,
      closed: false,
      days: [
        { label: "Lunes 14", we: false },
        { label: "Martes 15", we: false },
        { label: "Miércoles 16", we: false },
        { label: "Jueves 17", we: false },
        { label: "Viernes 18", we: false },
        { label: "Sábado 19", we: true },
        { label: "Domingo 20", we: true },
      ],
    },
    {
      id: "dic_4",
      name: "Semana 4",
      month: "Diciembre",
      order: 4,
      closed: false,
      days: [
        { label: "Lunes 21", we: false },
        { label: "Martes 22", we: false },
        { label: "Miércoles 23", we: false },
        { label: "Jueves 24", we: true },
        { label: "Viernes 25 <br>(Feriado)", we: true },
        { label: "Sábado 26", we: true },
        { label: "Domingo 27", we: true },
      ],
    },
    {
      id: "dic_5",
      name: "Semana 5",
      month: "Diciembre",
      order: 5,
      closed: false,
      days: [
        { label: "Lunes 28", we: false },
        { label: "Martes 29", we: false },
        { label: "Miércoles 30", we: false },
        { label: "Jueves 31", we: true },
        { label: "Viernes 1 <br>(Año Nuevo)", we: true },
        { label: "Sábado 2", we: true },
        { label: "Domingo 3", we: true },
      ],
    },
    {
      id: "ene_1",
      name: "Semana 1",
      month: "Enero",
      order: 6,
      closed: false,
      days: [
        { label: "Lunes 4 Ene", we: false },
        { label: "Martes 5", we: false },
        { label: "Miércoles 6", we: false },
        { label: "Jueves 7", we: false },
        { label: "Viernes 8", we: false },
        { label: "Sábado 9", we: true },
        { label: "Domingo 10", we: true },
      ],
    },
    {
      id: "ene_2",
      name: "Semana 2",
      month: "Enero",
      order: 7,
      closed: false,
      days: [
        { label: "Lunes 11", we: false },
        { label: "Martes 12", we: false },
        { label: "Miércoles 13", we: false },
        { label: "Jueves 14", we: false },
        { label: "Viernes 15", we: false },
        { label: "Sábado 16", we: true },
        { label: "Domingo 17", we: true },
      ],
    },
    {
      id: "ene_3",
      name: "Semana 3",
      month: "Enero",
      order: 8,
      closed: false,
      days: [
        { label: "Lunes 18", we: false },
        { label: "Martes 19", we: false },
        { label: "Miércoles 20", we: false },
        { label: "Jueves 21", we: false },
        { label: "Viernes 22", we: false },
        { label: "Sábado 23", we: true },
        { label: "Domingo 24", we: true },
      ],
    },
    {
      id: "ene_4",
      name: "Semana 4",
      month: "Enero",
      order: 9,
      closed: false,
      days: [
        { label: "Lunes 25", we: false },
        { label: "Martes 26", we: false },
        { label: "Miércoles 27", we: false },
        { label: "Jueves 28", we: false },
        { label: "Viernes 29", we: false },
        { label: "Sábado 30", we: true },
        { label: "Domingo 31", we: true },
      ],
    },
    {
      id: "feb_1",
      name: "Semana 1",
      month: "Febrero",
      order: 10,
      closed: false,
      days: [
        { label: "Lunes 1 Feb", we: false },
        { label: "Martes 2", we: false },
        { label: "Miércoles 3", we: false },
        { label: "Jueves 4", we: false },
        { label: "Viernes 5", we: false },
        { label: "Sábado 6", we: true },
        { label: "Domingo 7", we: true },
      ],
    },
    {
      id: "feb_2",
      name: "Semana 2",
      month: "Febrero",
      order: 11,
      closed: false,
      days: [
        { label: "Lunes 8", we: false },
        { label: "Martes 9", we: false },
        { label: "Miércoles 10", we: false },
        { label: "Jueves 11", we: false },
        { label: "Viernes 12", we: false },
        { label: "Sábado 13", we: true },
        { label: "Domingo 14", we: true },
      ],
    },
    {
      id: "feb_3",
      name: "Semana 3",
      month: "Febrero",
      order: 12,
      closed: false,
      days: [
        { label: "Lunes 15", we: false },
        { label: "Martes 16", we: false },
        { label: "Miércoles 17", we: false },
        { label: "Jueves 18", we: false },
        { label: "Viernes 19", we: false },
        { label: "Sábado 20", we: true },
        { label: "Domingo 21", we: true },
      ],
    },
    {
      id: "feb_4",
      name: "Semana 4",
      month: "Febrero",
      order: 13,
      closed: false,
      days: [
        { label: "Lunes 22", we: false },
        { label: "Martes 23", we: false },
        { label: "Miércoles 24", we: false },
        { label: "Jueves 25", we: false },
        { label: "Viernes 26", we: false },
        { label: "Sábado 27", we: true },
        { label: "Domingo 28", we: true },
      ],
    },
    {
      id: "mar_1",
      name: "Semana 1",
      month: "Marzo",
      order: 14,
      closed: false,
      days: [
        { label: "Lunes 1 Mar", we: false },
        { label: "Martes 2", we: false },
        { label: "Miércoles 3", we: false },
        { label: "Jueves 4", we: false },
        { label: "Viernes 5", we: false },
        { label: "Sábado 6", we: true },
        { label: "Domingo 7", we: true },
      ],
    },
  ];
  return list.map((w) => ({
    ...w,
    days: w.days.map((d) => ({ ...d })),
    cells: {},
  }));
}

export function defaults() {
  const P =
    "Martín Gómez,Lucía Fernández,Diego Ramírez,Valentina Torres,Nicolás Herrera,Camila Ortiz".split(
      ",",
    );
  const E =
    "Tomás Medina,Julieta Silva,Bruno Castro,Agustina Ríos,Franco Luna,Sofía Navarro".split(
      ",",
    );
  const ws = defaultWeeks();
  return {
    staff: [
      ...P.map((n) => ({ id: uid(), name: n, type: "P" })),
      ...E.map((n) => ({ id: uid(), name: n, type: "E" })),
    ],
    rates: {
      P: { wk: 6000, we: 7500 },
      E: { wk: 4000, we: 5000 },
    },
    rain: 0.5,
    turnos: TURNOS(),
    weeks: ws,
    cur: ws[0].id,
    tab: "semana",
    mf: "Diciembre",
  };
}

export function calc(S, w) {
  if (w.closed && w.snapshot) {
    return w.snapshot;
  }

  const R = {};
  S.staff.forEach(
    (p) =>
      (R[p.id] = {
        hw: 0,
        hwe: 0,
        hr: 0,
        mw: 0,
        mwe: 0,
        total: 0,
      }),
  );
  w.days.forEach((d, di) =>
    S.turnos.forEach((sh, si) => {
      const c = w.cells[di + "_" + si];
      if (!c) return;
      const hrs = $(d.we ? sh.hsWe : sh.hs);
      c.slots.forEach((id) => {
        const p = S.staff.find((x) => x.id === id);
        if (!p) return;
        const f = c.rain ? S.rain : 1,
          m = hrs * $(S.rates[p.type][d.we ? "we" : "wk"]) * f,
          r = R[id];
        if (d.we) {
          r.hwe += hrs;
          r.mwe += m;
        } else {
          r.hw += hrs;
          r.mw += m;
        }
        if (c.rain) r.hr += hrs;
      });
    }),
  );
  S.staff.forEach((p) => {
    const r = R[p.id];
    r.total = r.mw + r.mwe;
  });
  return R;
}
