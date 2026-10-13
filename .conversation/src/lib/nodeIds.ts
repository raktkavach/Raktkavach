function rand(len: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: len }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function getOrCreate(key: string, prefix: string): string {
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) return stored;
    const id = `${prefix}-${rand(4)}`;
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return `${prefix}-${rand(4)}`;
  }
}

export const nodeIds = {
  hospital: () => getOrCreate("rktk_hosp_id", "HOSP"),
  lab: () => getOrCreate("rktk_lab_id", "LAB"),
  clinic: () => getOrCreate("rktk_clin_id", "CLIN"),
  authority: () => getOrCreate("rktk_auth_id", "NATL"),
  who: () => getOrCreate("rktk_who_id", "WHO"),
  donor: () => "RKTK-7X9P-2D4F",
};
