const posts = [
  {
    id: 1,
    title: "Belajar Next.js dalam Semalam",
    category: "Teknologi",
    description:
      "Panduan lengkap menguasai Next.js dengan cepat dan efisien bagi pemula.",
    author: "Aras",
    date: "11 Feb 2026",
  },
  {
    id: 2,
    title: "Rahasia Map dan Set di JavaScript",
    category: "Coding",
    description:
      "Mengapa Map lebih baik daripada Object biasa dalam kasus tertentu? Mari bedah.",
    author: "Budi",
    date: "10 Feb 2026",
  },
  {
    id: 3,
    title: "Masa Depan Web Development",
    category: "Tren",
    description:
      "Turbopack dan masa depan kecepatan rendering di dunia web modern.",
    author: "Siti",
    date: "09 Feb 2026",
  },
];

// const category = "category";
console.dir(Array.prototype)

const berita = () => {
  return (
    <div className="m-10 bg-violet-300 p-5 rounded-lg">
      <h1 className="font-bold text-3xl text-center text-violet-600 mb-10">
        Halaman Berita
      </h1>
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 my-4">
          <div className="p-6">

            <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full uppercase">
              {post['category']}
            </span>

            <h2 className="mt-4 text-xl font-bold text-gray-800 leading-tight">
              {post.title}
            </h2>

            <p className="mt-3 text-gray-600 text-sm line-clamp-5">
              {post.description}
            </p>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-gray-500">{post.date}</p>
              </div>
              <button className="text-blue-500 hover:text-blue-700 font-semibold text-sm">
                Baca Selengkapnya →
              </button>
            </div>
          </div>
        </div>
      ))}
      <p>
  Harga produk ini adalah <span className="text-red-500">Rp 50.000</span>.
</p>

    </div>
  );
};

export default berita;

// 1. SET: Untuk mengumpulkan daftar mata pelajaran unik dari tumpukan data kotor
const mataPelajaranKotor = ["Math", "English", "Math", "Science", "English"];
const kategoriUnik = new Set(mataPelajaranKotor); 
// Hasil: Set {"Math", "English", "Science"}

// 2. MAP: Untuk menyimpan skor siswa berdasarkan ID Unik (Key-nya angka)
const databaseSkor = new Map();
databaseSkor.set(101, { math: 90, english: 85 });
databaseSkor.set(102, { math: 75, english: 95 });

// 3. ARRAY of OBJECTS: Data utama yang akan kita tampilkan di layar (Next.js)
const daftarSiswa = [
  { 
    id: 101, 
    nama: "Aras", 
    tags: [...kategoriUnik] // Mengubah Set kembali jadi Array
  },
  { 
    id: 102, 
    nama: "Budi", 
    tags: ["Math"] 
  }
];

// 4. MENGGABUNGKAN SEMUANYA:
const laporanLengkap = daftarSiswa.map(siswa => {
  // Mengambil data dari Map menggunakan ID dari Array of Objects
  const skor = databaseSkor.get(siswa.id);
  
  return {
    ...siswa, // Mengambil properti object asli (Destructuring)
    nilaiRataRata: (skor.math + skor.english) / 2
  };
});
console.log(kategoriUnik);
console.log(laporanLengkap);
