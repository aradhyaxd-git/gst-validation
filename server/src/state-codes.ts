import type { StateInfo } from "./types";

export const STATE_CODES: Readonly<Record<string, StateInfo>> = {
  "01": { name: "Jammu & Kashmir", legacy: false },
  "02": { name: "Himachal Pradesh", legacy: false },
  "03": { name: "Punjab", legacy: false },
  "04": { name: "Chandigarh", legacy: false },
  "05": { name: "Uttarakhand", legacy: false },
  "06": { name: "Haryana", legacy: false },
  "07": { name: "Delhi", legacy: false },
  "08": { name: "Rajasthan", legacy: false },
  "09": { name: "Uttar Pradesh", legacy: false },
  "10": { name: "Bihar", legacy: false },
  "11": { name: "Sikkim", legacy: false },
  "12": { name: "Arunachal Pradesh", legacy: false },
  "13": { name: "Nagaland", legacy: false },
  "14": { name: "Manipur", legacy: false },
  "15": { name: "Mizoram", legacy: false },
  "16": { name: "Tripura", legacy: false },
  "17": { name: "Meghalaya", legacy: false },
  "18": { name: "Assam", legacy: false },
  "19": { name: "West Bengal", legacy: false },
  "20": { name: "Jharkhand", legacy: false },
  "21": { name: "Odisha", legacy: false },
  "22": { name: "Chhattisgarh", legacy: false },
  "23": { name: "Madhya Pradesh", legacy: false },
  "24": { name: "Gujarat", legacy: false },
  "25": { name: "Andaman and Nicobar Islands", legacy: true },
  "26": { name: "Dadra and Nagar Haveli and Daman and Diu", legacy: false },
  "27": { name: "Maharashtra", legacy: false },
  "28": { name: "Andhra Pradesh (old)", legacy: true },
  "29": { name: "Karnataka", legacy: false },
  "30": { name: "Goa", legacy: false },
  "31": { name: "Lakshadweep", legacy: false },
  "32": { name: "Kerala", legacy: false },
  "33": { name: "Tamil Nadu", legacy: false },
  "34": { name: "Puducherry", legacy: false },
  "35": { name: "Andaman and Nicobar Islands", legacy: false },
  "36": { name: "Telangana", legacy: false },
  "37": { name: "Andhra Pradesh", legacy: false },
  "38": { name: "Ladakh", legacy: false },
};


export function getStateByCode(code: string): StateInfo | null {
  return STATE_CODES[code] ?? null;
}


export function getCodeByState(name: string): string | null {
  for (const [code, info] of Object.entries(STATE_CODES)) {
    if (info.name === name) return code;
  }
  return null;
}
