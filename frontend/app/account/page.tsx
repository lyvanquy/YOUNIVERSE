"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../YouniverseApp";
import { Camera, User, ShoppingBag, MapPin, LogOut, Heart } from "lucide-react";
import { translations } from "../locales";
import { apiRequest, type ApiOrder } from "../lib/api";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthInitialized, logout, language, updateAvatar, updateProfile } = useYouniverseApp();
  const t = translations[language];
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  // Inline edit profile and address coordinate states
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address suggestions, geolocation, and Google Maps states
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string }>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);

  // Load Google Maps SDK dynamically if API Key is configured
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    const google = (window as any).google;
    if (google?.maps) {
      setGoogleMapsReady(true);
      return;
    }

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsReady(true);
      script.onerror = () => console.warn("Google Maps SDK failed to load.");
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setGoogleMapsReady(true));
    }
  }, []);

  const handleAddressChange = async (value: string) => {
    setEditAddress(value);
    if (value.trim().length < 4) {
      setSuggestions([]);
      return;
    }

    const google = (window as any).google;
    if (googleMapsReady && google?.maps?.places) {
      setLoadingSuggestions(true);
      try {
        const autocompleteService = new google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
          { input: value, componentRestrictions: { country: "vn" } },
          (predictions: any[], status: any) => {
            if (status === "OK" && predictions) {
              setSuggestions(
                predictions.map((p) => ({
                  display_name: p.description,
                }))
              );
            } else {
              setSuggestions([]);
            }
            setLoadingSuggestions(false);
          }
        );
      } catch (e) {
        console.warn("Google Places Autocomplete failed, falling back to Nominatim", e);
        fallbackNominatimSearch(value);
      }
    } else {
      fallbackNominatimSearch(value);
    }
  };

  const fallbackNominatimSearch = async (value: string) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&countrycodes=vn`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      }
    } catch (e) {
      console.warn("Failed to fetch address suggestions", e);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      fallbackToIpLocation();
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const google = (window as any).google;
        if (googleMapsReady && google?.maps?.Geocoder) {
          try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results: any[], status: any) => {
                if (status === "OK" && results && results[0]) {
                  setEditAddress(results[0].formatted_address);
                  setSuggestions([]);
                } else {
                  fallbackNominatimReverse(latitude, longitude);
                }
                setLocating(false);
              }
            );
          } catch (e) {
            console.warn("Google Geocoding failed, falling back to Nominatim", e);
            fallbackNominatimReverse(latitude, longitude);
          }
        } else {
          fallbackNominatimReverse(latitude, longitude);
        }
      },
      (error) => {
        console.warn("Geolocation error, attempting IP fallback", error);
        fallbackToIpLocation();
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fallbackToIpLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data && data.city) {
        const locationStr = `${data.city}, ${data.region || ""}, ${data.country_name || "Vietnam"}`;
        setEditAddress(locationStr);
        setSuggestions([]);
      } else {
        alert(language === "vi" ? "Không thể lấy vị trí hiện tại." : "Failed to retrieve current location.");
      }
    } catch (e) {
      console.warn("IP Geolocation fallback failed", e);
      alert(language === "vi" ? "Không thể lấy vị trí hiện tại." : "Failed to retrieve current location.");
    } finally {
      setLocating(false);
    }
  };

  const fallbackNominatimReverse = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await res.json();
      if (data && data.display_name) {
        setEditAddress(data.display_name);
        setSuggestions([]);
      } else {
        setEditAddress(`${latitude}, ${longitude}`);
      }
    } catch (e) {
      setEditAddress(`${latitude}, ${longitude}`);
    } finally {
      setLocating(false);
    }
  };

  const handleStartInlineEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditPhone(user.phone || "");
    setEditAddress(user.address || "");
    setProfileError(null);
    setSuggestions([]);
    setIsEditingInline(true);
  };

  const handleSaveInlineProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editAddress.trim()) {
      setProfileError(language === "vi" ? "Vui lòng nhập họ tên và địa chỉ." : "Please enter both name and address.");
      return;
    }
    setUpdatingProfile(true);
    setProfileError(null);
    try {
      await updateProfile(editName, editPhone, editAddress);
      setIsEditingInline(false);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Không thể cập nhật thông tin.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Route Guard: Redirect if not authenticated
  useEffect(() => {
    if (isAuthInitialized && !isAuthenticated) {
      router.replace("/login?returnTo=%2Faccount");
    }
  }, [isAuthInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setOrdersLoading(true);
    setOrdersError(null);
    apiRequest<{ items: ApiOrder[] }>("/orders/me?page=1&limit=20")
      .then((data) => setOrders(data.items))
      .catch((error) => setOrdersError(error instanceof Error ? error.message : "Không tải được lịch sử đơn hàng."))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatarUrl]);

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError(language === "vi" ? "Vui lòng chọn một file ảnh." : "Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(language === "vi" ? "Ảnh đại diện tối đa 5MB." : "Avatar image must be 5MB or smaller.");
      return;
    }

    setAvatarUploading(true);
    setAvatarError(null);

    try {
      const body = new FormData();
      body.set("file", file);

      const uploaded = await apiRequest<{ url: string }>("/upload/image", {
        method: "POST",
        body,
      });

      await updateAvatar(uploaded.url);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "Không cập nhật được ảnh đại diện.");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 z-10" id="account-page">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-15%] w-[350px] h-[350px] rounded-full bg-blue-500/4 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[-15%] w-[350px] h-[350px] rounded-full bg-rose-500/3 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow duration-5000" />

      {/* Breadcrumb */}
      <div className="text-left font-mono text-[10px] text-stone-400 uppercase tracking-widest relative z-10">
        {t.accountBreadcrumb}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Voyager Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 shadow-md text-left space-y-6 relative overflow-hidden">
            {/* Tech coordinates grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808002_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

            <div className="flex items-center space-x-4 relative z-10">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200 flex items-center justify-center shadow-inner group/avatar">
                <div className="absolute inset-[-3px] rounded-full border border-dashed border-blue-400/40 animate-spin-slow" />
                {user.avatarUrl && !avatarLoadFailed ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarLoadFailed(true)}
                    className="relative z-10 h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="relative z-10 h-7 w-7 text-blue-500" />
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={language === "vi" ? "Cập nhật ảnh đại diện" : "Update avatar"}
                  title={language === "vi" ? "Cập nhật ảnh đại diện" : "Update avatar"}
                >
                  {avatarUploading ? (
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-tight text-stone-900 truncate max-w-[160px]">
                  {user.name}
                </h3>
              </div>
            </div>

            {avatarError && (
              <div className="relative z-10 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-[11px] text-rose-600">
                {avatarError}
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-stone-100 text-xs font-sans text-stone-600 relative z-10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-0.5">{t.accountStellarEmail}</span>
                <span className="font-medium text-stone-900">{user.email}</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-0.5">{t.accountCommLink}</span>
                <span className="font-medium text-stone-900">{user.phone || t.accountNotLinked}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full rounded-full border border-rose-200 bg-rose-50/20 hover:bg-rose-50 text-rose-600 hover:text-rose-700 py-3 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer relative z-10 shadow-sm hover:shadow"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.accountLogout}</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white/60 backdrop-blur-md border border-stone-200/40 rounded-[24px] p-5 text-left space-y-2 relative">
            <div className="flex items-center space-x-2 text-stone-800">
              <Heart className="h-4 w-4 text-rose-500 animate-float" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider">{t.accountMemberPerks}</h4>
            </div>
            <p className="font-sans text-[11px] text-stone-500 leading-relaxed">
              {t.accountMemberPerksDesc}
            </p>
          </div>
        </div>

        {/* Right Column: Order History and Address Coordinates */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Order history segment */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 md:p-8 shadow-md space-y-6">
            <div className="flex items-center space-x-2 text-stone-950">
              <ShoppingBag className="h-5 w-5 text-stone-700" />
              <h3 className="font-display text-lg font-black uppercase tracking-tight">{t.accountOrderLogs}</h3>
            </div>

            <div className="space-y-4">
              {ordersLoading && (
                <div className="border border-stone-100 bg-stone-50/30 p-5 rounded-2xl text-xs text-stone-500">
                  Đang tải lịch sử đơn hàng...
                </div>
              )}

              {ordersError && (
                <div className="border border-rose-100 bg-rose-50/50 p-5 rounded-2xl text-xs text-rose-600">
                  {ordersError}
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="border border-stone-100 bg-stone-50/30 p-5 rounded-2xl text-xs text-stone-500">
                  Chưa có đơn hàng nào được ghi nhận trên backend.
                </div>
              )}

              {orders.map((order) => (
                <div key={order.id} className="border border-stone-100 bg-stone-50/30 hover:bg-stone-50/70 p-5 rounded-2xl transition-all duration-300 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-stone-100">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-900">{order.orderCode}</span>
                      <span className="text-[10px] font-sans text-stone-400 block sm:inline sm:ml-3">
                        {new Intl.DateTimeFormat("vi-VN").format(new Date(order.createdAt))}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border text-amber-600 bg-amber-500/10 border-amber-500/20">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] font-mono uppercase tracking-wider block">{t.accountItemsPurchased}</span>
                      <span className="font-sans font-medium text-stone-700">
                        {order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-400 text-[10px] font-mono uppercase tracking-wider block">{t.accountCosmicValue}</span>
                      <span className="font-display font-extrabold text-stone-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Coordinate Block */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 md:p-8 shadow-md space-y-6">
            <div className="flex items-center space-x-2 text-stone-950">
              <MapPin className="h-5 w-5 text-stone-700" />
              <h3 className="font-display text-lg font-black uppercase tracking-tight">{t.accountShippingCoords}</h3>
            </div>

            <div className="border border-stone-100 bg-stone-50/30 p-5 rounded-2xl text-xs space-y-2">
              {isEditingInline ? (
                <form onSubmit={handleSaveInlineProfile} className="space-y-3">
                  {profileError && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-[11px] text-rose-600">
                      {profileError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="inline-name">
                        {language === "vi" ? "Họ và tên *" : "Full Name *"}
                      </label>
                      <input
                        id="inline-name"
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-sans text-black focus:border-stone-400 focus:outline-none bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="inline-phone">
                        {language === "vi" ? "Số điện thoại" : "Phone Number"}
                      </label>
                      <input
                        id="inline-phone"
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-sans text-black focus:border-stone-400 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="inline-address">
                        {language === "vi" ? "Tọa độ giao hàng *" : "Shipping Address *"}
                      </label>
                      <button
                        type="button"
                        onClick={handleLocateMe}
                        disabled={locating}
                        className="text-[9px] font-mono text-stone-600 hover:text-stone-900 font-bold uppercase tracking-wider hover:underline focus:outline-none flex items-center space-x-1.5 disabled:opacity-60 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="url(#googleMapsGradientAccount)" />
                          <circle cx="12" cy="9" r="3" fill="white" />
                          <defs>
                            <linearGradient id="googleMapsGradientAccount" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#EA4335" />
                              <stop offset="30%" stopColor="#FBBC05" />
                              <stop offset="60%" stopColor="#34A853" />
                              <stop offset="100%" stopColor="#4285F4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span>{locating ? (language === "vi" ? "Đang định vị..." : "Locating...") : (language === "vi" ? "Định vị hiện tại" : "Auto-Locate")}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        id="inline-address"
                        required
                        rows={2}
                        value={editAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-sans text-black focus:border-stone-400 focus:outline-none bg-white resize-none"
                      />

                      {/* Autocomplete Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="absolute z-20 w-full bg-white border border-stone-200 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto text-xs font-sans">
                          {suggestions.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setEditAddress(item.display_name);
                                setSuggestions([]);
                              }}
                              className="px-3 py-2 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-b-0 text-stone-700 truncate"
                            >
                              {item.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {editAddress && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-stone-200 h-[120px] relative z-10">
                      <iframe
                        title="Google Map Edit Preview"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(editAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      disabled={updatingProfile}
                      onClick={() => setIsEditingInline(false)}
                      className="rounded-full border border-stone-200 bg-white text-stone-600 px-4 py-2 font-display text-[10px] font-bold tracking-widest uppercase transition hover:bg-stone-50 cursor-pointer disabled:opacity-50"
                    >
                      {language === "vi" ? "Hủy" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="rounded-full bg-stone-950 hover:bg-black text-white px-4 py-2 font-display text-[10px] font-bold tracking-widest uppercase transition flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                    >
                      {updatingProfile ? (
                        <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>{language === "vi" ? "Lưu" : "Save"}</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-4">
                    <span className="font-sans font-bold text-stone-800 block">{user.name}</span>
                    <span className="font-sans text-stone-600 leading-relaxed block mt-1">
                      {user.address || t.addressText}
                    </span>
                    
                    {/* Google Map Preview in Display Mode */}
                    <div className="mt-3 rounded-xl overflow-hidden border border-stone-200/80 h-[120px]">
                      <iframe
                        title="Google Map Display"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(user.address || t.addressText)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleStartInlineEdit}
                    className="font-mono text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase hover:underline focus:outline-none cursor-pointer shrink-0"
                  >
                    {t.accountEdit}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

