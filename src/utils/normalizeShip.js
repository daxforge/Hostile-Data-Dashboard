import { getShipImage } from "./helpers";

export const normalizeShip = (raw) => {
  const capacity =
    Number(
      raw.capacity ??
      raw.ship_capacity ??
      raw.shipCapacity ??
      0
    ) || 0;

  const price =
    Number(
      raw.price ??
      raw.ship_price ??
      raw.shipPrice ??
      0
    ) || 0;

  const coreType =
    raw?.engine?.core_type ??
    raw?.engine?.coreType ??
    raw?.specs?.engine?.core_type ??
    raw?.specs?.engine?.coreType ??
    "unknown";

  const name =
    raw.name ??
    raw.ship_name ??
    raw.shipName ??
    "Unnamed Ship";

  const manufacturer =
    raw.manufacturer ??
    raw.maker ??
    "Unknown Manufacturer";

  const image = getShipImage(name);

  const status =
    raw.status ??
    "Unknown";

  const isCritical =
    capacity > 100 &&
    coreType?.toLowerCase() === "plasma";

  return {
    id: raw.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
    name,
    manufacturer,
    capacity,
    price,
    coreType,
    image,
    status,
    isCritical,
  };
};

