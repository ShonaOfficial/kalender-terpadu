cat > src/web.js << 'EOF'
// Fungsi Kalender Terpadu untuk Browser
const JAWA_HARI = ['Ahad', 'Senin', 'Selasa', 'Rebo', 'Kemis', 'Jumat', 'Setu'];
const JAWA_PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const JAWA_BULAN = ['Sura', 'Sapar', 'Mulud', 'Bakda Mulud', 'Jumadilawal', 'Jumadilakir', 'Rejeb', 'Ruwah', 'Pasa', 'Sawal', 'Sela', 'Besar'];
const JAWA_TAHUN = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir'];
const HIJRI_BULAN = ['Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir", 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];
const MASEHI_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MASEHI_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function toJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12), y = year + 4800 - a, m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getKalenderLengkap(date) {
  const masehi = { string: `${MASEHI_HARI[date.getDay()]}, ${date.getDate()} ${MASEHI_BULAN[date.getMonth()]} ${date.getFullYear()}` };
  
  let nongli = null;
  try {
    const nl = solarLunar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (nl && nl !== -1) {
      const monthCnArr = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
      const dayCnArr = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
      const namaBulan = (nl.isLeap ? '闰' : '') + monthCnArr[nl.lMonth - 1] + '月';
      const namaHari = dayCnArr[nl.lDay - 1];
      const tahunKongzili = nl.lYear + 551;
      nongli = { string: `${tahunKongzili}年 (${nl.gzYear}) ${namaBulan}${namaHari} - Shio ${nl.animal}` };
    }
  } catch(e) { nongli = { string: "Error memuat Nongli" }; }

  let hijriah = null;
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const parts = fmt.formatToParts(date), get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
    hijriah = { string: `${get('day')} ${HIJRI_BULAN[get('month') - 1]} ${get('year')} H` };
  } catch (e) { hijriah = { string: "Error memuat Hijriah" }; }

  let jawa = null;
  if (hijriah) {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const parts = fmt.formatToParts(date), get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
    const jdn = toJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const tahunJawa = get('year') + 512;
    const winduIdx = (((tahunJawa - 1555) % 8) + 8) % 8;
    const pasaran = JAWA_PASARAN[(jdn + 3) % 5];
    jawa = { string: `${JAWA_HARI[date.getDay()]} ${pasaran}, ${get('day')} ${JAWA_BULAN[get('month') - 1]} ${tahunJawa} ${JAWA_TAHUN[winduIdx]}` };
  }

  return { masehi, nongli, hijriah, jawa };
}
EOF