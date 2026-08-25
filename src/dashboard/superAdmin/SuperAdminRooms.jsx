import React, { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBed,
  FaUsers,
  FaDollarSign,
  FaTimes,
  FaCheck,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SuperAdminRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [roomsList, setRoomsList] = useState([
    {
      id: "R-101",
      title: "Room 001 - Ocean Deluxe",
      category: "Standard",
      basePrice: 320,
      maxGuests: 3,
      size: "55 m²",
      status: "available",
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "R-201",
      title: "Room 201 - Executive Panorama",
      category: "Executive",
      basePrice: 620,
      maxGuests: 4,
      size: "85 m²",
      status: "available",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "R-401",
      title: "Suite 401 - Royal Presidential",
      category: "Presidential",
      basePrice: 1840,
      maxGuests: 6,
      size: "180 m²",
      status: "occupied",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "R-501",
      title: "Suite 501 - Grand Penthouse",
      category: "Penthouse",
      basePrice: 2200,
      maxGuests: 8,
      size: "240 m²",
      status: "available",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Standard",
    basePrice: 350,
    maxGuests: 2,
    size: "60 m²",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
  });

  const handleAddRoom = (e) => {
    e.preventDefault();
    const newRoom = {
      id: `R-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title || "New Hotel Suite",
      category: formData.category,
      basePrice: Number(formData.basePrice),
      maxGuests: Number(formData.maxGuests),
      size: formData.size,
      status: "available",
      image: formData.image,
    };
    setRoomsList([newRoom, ...roomsList]);
    setShowAddModal(false);
    toast.success(`Created room "${newRoom.title}" in Master Catalog!`);
  };

  const handleDeleteRoom = (id, title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      setRoomsList(roomsList.filter((r) => r.id !== id));
      toast.info(`Deleted ${title}`);
    }
  };

  const filtered = roomsList.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Master Room Catalog & Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin control to add rooms, configure base prices, and update category listings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-800 hover:to-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FaPlus />
          <span>Add New Room Listing</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search catalog rooms by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* List of Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {room.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={room.status} size="sm" />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg font-serif">
                      {room.title}
                    </h3>
                    <p className="text-xs text-slate-400">{room.id} • {room.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-amber-600 font-serif">
                      ${room.basePrice}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      per night
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <FaUsers className="text-amber-600" />
                    <span>Up to {room.maxGuests} guests</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaBed className="text-amber-600" />
                    <span>King Suite</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => toast.info(`Editing price for ${room.title}`)}
                className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FaEdit className="text-slate-500" />
                <span>Edit Pricing</span>
              </button>
              <button
                onClick={() => handleDeleteRoom(room.id, room.title)}
                className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                title="Delete Listing"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddRoom}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-scale-up text-xs"
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <FaTimes className="text-base" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 font-serif border-b border-slate-100 pb-3">
              Add New Catalog Room
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Room Title & Name</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Suite 601 - Royal Sunset Penthouse"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Base Price ($/night)</label>
                <input
                  type="number"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Guests</label>
                <input
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Room Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 font-bold rounded-xl text-white shadow-md cursor-pointer"
              >
                Save Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRooms;
