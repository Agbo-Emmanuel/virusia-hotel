// Total guests a room sleeps. Falls back to the old field name for rooms that
// haven't been migrated from numberOfGuest to capacity yet.
export const roomCapacity = (room) => room?.capacity ?? room?.numberOfGuest;

const isNum = (value) => Number.isFinite(value);

// Mirrors the backend check. Returns a readable problem, or "" if the party fits.
export const guestLimitMessage = (room, adults, children) => {
  const capacity = roomCapacity(room);

  if (isNum(room?.maxAdults) && adults > room.maxAdults) {
    return `This room allows a maximum of ${room.maxAdults} adult${room.maxAdults === 1 ? "" : "s"}.`;
  }
  if (isNum(room?.maxChildren) && children > room.maxChildren) {
    return room.maxChildren === 0
      ? "This room does not allow children."
      : `This room allows a maximum of ${room.maxChildren} child${room.maxChildren === 1 ? "" : "ren"}.`;
  }
  if (isNum(capacity) && adults + children > capacity) {
    return `This room sleeps a maximum of ${capacity} guest${capacity === 1 ? "" : "s"} in total.`;
  }
  return "";
};

// Short, human summary of a room's limits, e.g. "Up to 4 guests"
export const describeCapacity = (room) => {
  const capacity = roomCapacity(room);
  return isNum(capacity)
    ? `Up to ${capacity} guest${capacity === 1 ? "" : "s"}`
    : "—";
};

// Extra detail lines, e.g. ["Max 3 adults", "Max 2 children"] or ["No children"]
export const describeLimits = (room) => {
  const parts = [];
  if (isNum(room?.maxAdults)) {
    parts.push(`Max ${room.maxAdults} adult${room.maxAdults === 1 ? "" : "s"}`);
  }
  if (isNum(room?.maxChildren)) {
    parts.push(
      room.maxChildren === 0
        ? "No children"
        : `Max ${room.maxChildren} child${room.maxChildren === 1 ? "" : "ren"}`,
    );
  }
  return parts;
};

export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;
