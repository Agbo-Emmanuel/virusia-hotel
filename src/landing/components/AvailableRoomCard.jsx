import { FaBed, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { formatPrice } from "../../utils/formatMoney";
import { describeCapacity, describeLimits } from "../../utils/roomGuest";

const AvailableRoomCard = ({ room, nights, onBook }) => {
  const image = room.images?.[0];
  const limits = describeLimits(room);

  return (
    <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={`Room ${room.roomNumber}`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">
            <FaBed />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/95 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
          {room.roomType}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Room {room.roomNumber}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <FaUsers className="text-amber-600" />
            {describeCapacity(room)}
          </p>
          {limits.length > 0 && (
            <p className="mt-1 text-[11px] text-slate-400 font-medium">
              {limits.join(" · ")}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {formatPrice(room.pricePerNight)} × {nights} night
                {nights === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                Total
              </span>
              <span className="font-serif text-2xl font-bold text-slate-900">
                {formatPrice(room.totalAmount)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBook(room)}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
          >
            <FaCalendarCheck />
            <span>Book this room</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default AvailableRoomCard;
