export function onlyDigits(str = "") {
  return (str || "").toString().replace(/\D/g, "");
}

export function formatRupiahInput(str = "") {
  const raw = onlyDigits(str);
  return raw ? Number(raw).toLocaleString("id-ID") : "";
}

export function parseRupiahToNumber(str = "") {
  // buang semua titik pemisah ribuan
  const raw = onlyDigits(str);
  return raw ? Number(raw) : 0;
}
