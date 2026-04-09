const SERIES_LABEL_KEYS = [
  "_id",
  "name",
  "label",
  "title",
  "status",
  "priority",
  "role",
  "key",
];

const SERIES_VALUE_KEYS = [
  "count",
  "value",
  "total",
  "amount",
  "size",
  "qty",
  "number",
];

const SERIES_CONTAINER_KEYS = [
  "data",
  "items",
  "results",
  "rows",
  "series",
  "docs",
];

export const normalizeKey = (value = "") =>
  String(value).toLowerCase().replace(/[\s_-]+/g, "");

export const getChartLabel = (item, fallback = "Unknown") => {
  if (!item || typeof item !== "object") return fallback;

  for (const key of SERIES_LABEL_KEYS) {
    const value = item[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }

  return fallback;
};

export const getChartCount = (item) => {
  if (!item || typeof item !== "object") return 0;

  for (const key of SERIES_VALUE_KEYS) {
    const value = item[key];
    if (value !== undefined && value !== null && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return 0;
};

const unwrapSeriesValue = (value) => {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    for (const key of SERIES_CONTAINER_KEYS) {
      const nested = value[key];
      if (Array.isArray(nested)) return nested;
    }
  }

  return [];
};

export const normalizeChartSeries = (data = []) =>
  (Array.isArray(data) ? data : []).map((item, index) => ({
    name: getChartLabel(item, `Item ${index + 1}`),
    value: getChartCount(item),
    raw: item,
  }));

export const findChartSeries = (source = {}, tokens = []) => {
  const normalizedTokens = tokens.map(normalizeKey).filter(Boolean);
  const candidates = [];

  const walk = (node, path = []) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;

    for (const [key, value] of Object.entries(node)) {
      const nextPath = [...path, key];
      const normalizedPath = normalizeKey(nextPath.join(" "));
      const series = unwrapSeriesValue(value);

      if (series.length > 0) {
        const score = normalizedTokens.reduce(
          (sum, token) => sum + (normalizedPath.includes(token) ? 1 : 0),
          0
        );

        candidates.push({ series, score, depth: nextPath.length });
      }

      if (value && typeof value === "object" && !Array.isArray(value)) {
        walk(value, nextPath);
      }
    }
  };

  walk(source);
  candidates.sort(
    (a, b) => b.score - a.score || b.depth - a.depth || b.series.length - a.series.length
  );

  const best = candidates.find((candidate) => candidate.score > 0);
  return best?.series || [];
};
