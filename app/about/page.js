import Link from "next/link";
const arrayku = [1, 2, 3, 4, 5];
arrayku.splice(2, 0, 99, 100);;
console.log(arrayku);

const spread = [...arrayku, 7, 8, 9];
console.log(spread);

const angkaterurut = arrayku.toSorted()
console.log(angkaterurut);
const produkMap = new Map([
  [10, { name: "Buku", price: 5000, stock: 15 }],
  [50, { name: "Laptop", price: 15000000, stock: 5 }],
]);

const Aboutpage = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-center my-5 bg-blue-500 max-w-md mx-auto rounded-full p-2">INi halaman about mari bermain</h2>

            <div className="flex justify-center gap-3 items-center my-10 mx-5">
                <p>Selamat datang di halaman about!</p>
                <ul>
                    {arrayku.map((item) => (
                        <li key={item}>Item: {item}</li>
                    ))}
                    {Array.from(produkMap, ([key, value]) => (
                        <li key={key}>
                            Nama: {value.name}, Harga: {value.price}, Stok: {value.stock}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-center">
                <Link href="/">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-white transition-colors border-1 border-white hover:border-green-600 hover:text-green-600 mx-auto">
                        Ke Home
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Aboutpage;
const rawIds = [101, 102, 101, 103, 102, 104];
const idYangPulang = 102;

// 1. Gunakan SET untuk membuat id yang duplikat jadi cukup kita masukkan array sebagai argumen ke dalam Set
const uniqueIds = new Set(rawIds);
console.log(uniqueIds);

// Kita bungkus uniqueIds ke dalam [ ... ] supaya bisa pakai .map() tapi kita juga bisa langsung pakai foreach untuk mengambil nilainya
const presensi = new Map();
uniqueIds.forEach(id => {
    presensi.set(id, "Hadir");
});
presensi.delete(idYangPulang); // Tandai ID yang pulang sebagai "Pulang"
console.log(presensi);


const antreanRaw = [10, 20, 10, 30];

// 1. Bersihkan duplikat dengan Set
const memberUnik = new Set(antreanRaw);

const pesanan = new Map();
memberUnik.forEach(id => {
    pesanan.set(id, "Kopi");
});


// 3. MODIFIKASI: Ubah pesanan ID 10 menjadi "Teh"
pesanan.set(10, "Teh");
pesanan.delete(20); // Hapus ID 20 dari Map

console.log(pesanan); 

const spekLaptop = {
  merk: "Asus",
  ram: "16GB",
  prosesor: "Ryzen 7",
  pasar :{
    indonesia: "Rp 15.000.000",
    amerika: "$1000",
    eropa: "€900"
  }
};

for (let key in spekLaptop) {

    if (typeof spekLaptop[key] === "object" && spekLaptop[key] !== null) {
        for (let subKey in spekLaptop[key]) {
            console.log(`${subKey}: ${spekLaptop[key][subKey]}`);
        }
    }else{
    console.log(`${key}: ${spekLaptop[key]}`)
    }
}

const stokGudang = new Map([
  ["Laptop", 5],
  ["Mouse", 12],
  ["Keyboard", 8]
]);

// Pakai destructuring [key, value] biar keren
for(let [namaProduk, jumlahStok] of stokGudang){
    console.log(`Produk: ${namaProduk}, Stok: ${jumlahStok}`);
}

// 1. Base Logic (Tetap pakai class untuk struktur dasar)
class Character {
  constructor(name) {
    this.name = name;
  }
  
  move() { console.log(`${this.name} bergerak...`); }
}

// 2. Modul Kemampuan (Mixins menggunakan Closure & Arrow Function)
const canAttack = (state) => ({
  attack: () => console.log(`${state.name} menebas dengan pedang!`)
});

const canCastSpell = (state) => ({
  castSpell: () => console.log(`${state.name} mengeluarkan api!`)
});

const canTeleport = (state) => ({
  teleport: () => console.log(`${state.name} berpindah tempat secara instan!`)
});

// 3. Fungsi Perakitan (Factory Functions)
function createWarrior(name) {
  const character = new Character(name);
  return Object.assign(
    character,
    canAttack(character),
    canTeleport(character)
);
}

function createMageWarrior(name) {
  const character = new Character(name);
  // Di sini keajaibannya: Kita gabungkan kemampuan APAPUN yang kita mau
  return Object.assign(
    character, 
    canAttack(character), 
    canCastSpell(character),
    canTeleport(character)
  );
}

// --- PENGGUNAAN OBJEK ---
const gatsby = createWarrior("Gatsby");
gatsby.attack();
gatsby.teleport();
gatsby.move() // Bisa

const merlin = createMageWarrior("Merlin");
merlin.move();      // Dari Class Dasar
merlin.attack();    // Dari Modul canAttack
merlin.castSpell(); // Dari Modul canCastSpell
merlin.teleport();  // Dari Modul canTeleport