"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    async function fetchWeatherByLocation(lat, lon) {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil data cuaca. Coba lagi nanti.");
      }

      const data = await res.json();
      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );
      const dataForecast = await resForecast.json();
      const dailyData = dataForecast.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);

      console.log(data);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    }

    async function fetchWeatherByCity(namaKota) {

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(namaKota)}&appid=${API_KEY}&units=metric&lang=id`
      );

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Kota tidak ditemukan. Coba nama kota lain.");
        }
        throw new Error("Gagal mengambil data cuaca. Coba lagi nanti.");
      }

      const data = await res.json();
      const resForecast = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(namaKota)}&appid=${API_KEY}&units=metric&lang=id`
);
const dataForecast = await resForecast.json();
const dailyData = dataForecast.list.filter(item => item.dt_txt.includes("12:00:00"));
setForecast(dailyData);


      console.log(data);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Jika dapet lokasinya, panggil fungsi fetch by location
        fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        // Kalau user menolak (deny) akses lokasi, atau error
        // Fallback ke default kota Makassar
        fetchWeatherByCity("Makassar");
      }
    );
  } else {
    fetchWeatherByCity("Makassar"); // Browser kuno
  }
}, []);

  const fetchWeather = (e) => {
  e.preventDefault();
  if (!city.trim()) return;
  fetchWeatherByCity(city.trim());
};

  const getWeatherGradient = () => {
    if (!weather) return "from-indigo-950 via-slate-900 to-slate-950";
    const id = weather.weather[0].id;
    if (id >= 200 && id < 300) return "from-gray-900 via-slate-800 to-violet-950"; // Thunderstorm
    if (id >= 300 && id < 600) return "from-slate-800 via-blue-900 to-cyan-950";   // Rain/Drizzle
    if (id >= 600 && id < 700) return "from-slate-200 via-blue-100 to-white";      // Snow
    if (id >= 700 && id < 800) return "from-amber-100 via-orange-200 to-yellow-100"; // Atmosphere
    if (id === 800) return "from-sky-400 via-blue-500 to-indigo-600";               // Clear
    return "from-slate-600 via-gray-700 to-slate-800";                              // Clouds
  };

    const getCustomWeatherIcon = (id) => {
    if (id >= 200 && id < 300) return "⛈️"; // Petir / Badai
    if (id >= 300 && id < 600) return "🌧️"; // Hujan
    if (id >= 600 && id < 700) return "❄️"; // Salju
    if (id >= 700 && id < 800) return "🌫️"; // Kabut / Berasap
    if (id === 800) return "☀️"; // Cerah
    if (id === 801 || id === 802) return "🌤️"; // Berawan sebagian (cerah)
    return "☁️"; // Berawan tebal
  };


  const isLightBg = () => {
    if (!weather) return false;
    const id = weather.weather[0].id;
    return (id >= 600 && id < 800);
  };

  const textColor = isLightBg() ? "text-gray-800" : "text-white";
  const subtextColor = isLightBg() ? "text-gray-600" : "text-white/70";
  const cardBg = isLightBg()
    ? "bg-white/50 border-gray-200/50"
    : "bg-white/10 border-white/10";

  const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} transition-all duration-1000 ease-in-out`}
    >
      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-12 min-h-screen">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg
              className={`w-10 h-10 ${textColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
            <h1
              className={`text-4xl font-bold ${textColor} tracking-tight`}
            >
              Cuaca
            </h1>
          </div>
          <p className={`${subtextColor} text-lg`}>
            Cari informasi cuaca kota di seluruh dunia
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={fetchWeather}
          className="w-full max-w-xl mb-10"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Masukkan nama kota... (contoh: Jakarta)"
              className={`w-full h-14 pl-5 pr-32 rounded-2xl ${cardBg} backdrop-blur-xl border ${textColor} placeholder:${subtextColor} text-lg outline-none focus:ring-2 focus:ring-blue-400/50 transition-all`}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 h-10 px-6 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Mencari...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Cari
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-xl mb-6 animate-in fade-in">
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/15 border border-red-400/30 backdrop-blur-xl">
              <svg
                className="w-6 h-6 text-red-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-red-300 text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weather && (
          <div className="w-full max-w-xl space-y-5 animate-in fade-in slide-in-from-bottom-4">
            {/* Main Weather Card */}
            <div
              className={`rounded-3xl ${cardBg} backdrop-blur-xl border p-8 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 cursor-default`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className={`text-base font-bold ${textColor} tracking-tight`}
                  >
                    {weather.name}
                  </h2>
                  <p className={`${subtextColor} text-base mt-1`}>
                    {weather.sys.country}
                  </p>
                </div>
                <div className="text-8xl drop-shadow-2xl animate-pulse">
                  {getCustomWeatherIcon(weather.weather[0].id)}
                </div>
              </div>

              <div className="flex items-end gap-4 mb-4">
                <span
                  className={`text-7xl font-extrabold ${textColor} leading-none tracking-tighter`}
                >
                  {Math.round(weather.main.temp)}°
                </span>
                <span className={`${subtextColor} text-xl mb-2`}>C</span>
              </div>

              <p
                className={`${textColor} text-xl capitalize font-medium mb-2`}
              >
                {weather.weather[0].description}
              </p>
              <p className={`${subtextColor} text-sm`}>
                Terasa seperti{" "}
                <span className={`${textColor} font-medium`}>
                  {Math.round(weather.main.feels_like)}°C
                </span>
              </p>
            </div>
            {/* Prediksi 5 Hari Ke Depan */}
{forecast && (
  <div className="mt-6 w-full max-w-xl">
    <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
      Prediksi 5 Hari Kedepan
    </h3>
    <div className="flex gap-4 overflow-x-hidden pt-4 pb-4 px-2 snap-x">
      {forecast.map((day, index) => {
        // Mengubah format tanggal menjadi hari (Senin, Selasa, dll)
        const date = new Date(day.dt * 1000);
        const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date);

        return (
          <div
            key={index}
            className={`min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl ${cardBg} border snap-center hover:scale-110 hover:-translate-y-2 hover:bg-white/20 transition-all duration-300 cursor-default`}
          >
            <p className={`${subtextColor} font-medium`}>{dayName}</p>
            <span className="text-4xl my-2 drop-shadow-lg hover:scale-110 transition-transform cursor-pointer">
  {getCustomWeatherIcon(day.weather[0].id)}
</span>
            <p className={`${textColor} font-bold text-lg`}>
              {Math.round(day.main.temp)}°
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}

            {/* Detail Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Humidity */}
              <div
                className={`rounded-2xl ${cardBg} backdrop-blur-xl border p-5 hover:scale-[1.05] hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m-7.071-2.929l.707-.707M4.222 4.222l.707.707m14.142 0l.707-.707M19.778 19.778l-.707-.707M1 12h1m16 0h1M12 7a5 5 0 100 10 5 5 0 000-10z"
                    />
                  </svg>
                  <span className={`${subtextColor} text-sm font-medium`}>
                    Kelembaban
                  </span>
                </div>
                <p className={`text-base font-bold ${textColor}`}>
                  {weather.main.humidity}
                  <span className="text-lg font-normal">%</span>
                </p>
              </div>

              {/* Wind */}
              <div
                className={`rounded-2xl ${cardBg} backdrop-blur-xl border p-5 hover:scale-[1.05] hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.5 12h12.25A3.25 3.25 0 1019 8.75M3.5 8h9.25A3.25 3.25 0 1016 4.75M3.5 16h6.25A3.25 3.25 0 1113 19.25"
                    />
                  </svg>
                  <span className={`${subtextColor} text-sm font-medium`}>
                    Angin
                  </span>
                </div>
                <p className={`text-base font-bold ${textColor}`}>
                  {weather.wind.speed}
                  <span className="text-lg font-normal"> m/s</span>
                </p>
              </div>

              {/* Pressure */}
              <div
                className={`rounded-2xl ${cardBg} backdrop-blur-xl border p-5 hover:scale-[1.05] hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v18m-6-6l6 6 6-6"
                    />
                  </svg>
                  <span className={`${subtextColor} text-sm font-medium`}>
                    Tekanan Udara
                  </span>
                </div>
                <p className={`text-base font-bold ${textColor}`}>
                  {weather.main.pressure}
                  <span className="text-lg font-normal"> hPa</span>
                </p>
              </div>

              {/* Visibility */}
              <div
                className={`rounded-2xl ${cardBg} backdrop-blur-xl border p-5 hover:scale-[1.05] hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className={`${subtextColor} text-sm font-medium`}>
                    Jarak Pandang
                  </span>
                </div>
                <p className={`text-base font-bold ${textColor}`}>
                  {(weather.visibility / 1000).toFixed(1)}
                  <span className="text-lg font-normal"> km</span>
                </p>
              </div>
            </div>

            {/* Sunrise & Sunset */}
            <div
              className={`rounded-2xl ${cardBg} backdrop-blur-xl border p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-default`}
            >
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-orange-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2m0 0a5 5 0 015 5H7a5 5 0 015-5zM3 17h18M5 21h14"
                    />
                  </svg>
                  <p className={`${subtextColor} text-xs mb-1`}>Matahari Terbit</p>
                  <p className={`${textColor} text-lg font-semibold`}>
                    {formatTime(weather.sys.sunrise, weather.timezone)}
                  </p>
                </div>
                <div className={`w-px h-12 ${isLightBg() ? 'bg-gray-300' : 'bg-white/20'}`} />
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-indigo-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2m0 0a5 5 0 015 5H7a5 5 0 015-5zM3 17h18M5 21h14M12 10v4"
                    />
                  </svg>
                  <p className={`${subtextColor} text-xs mb-1`}>Matahari Terbenam</p>
                  <p className={`${textColor} text-lg font-semibold`}>
                    {formatTime(weather.sys.sunset, weather.timezone)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!weather && !loading && !error && (
          <div className={`text-center ${subtextColor} mt-10`}>
            <svg
              className="w-20 h-20 mx-auto mb-4 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
            <p className="text-lg">Cari kota untuk melihat cuaca</p>
          </div>
        )}
      </div>
    </div>
  );
}
