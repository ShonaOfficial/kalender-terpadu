const solarLunar = require('solarlunar');
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

function getMasehi(date) {
  return { hari: date.getDate(), bulan: date.getMonth() + 1, tahun: date.getFullYear(), namaHari: MASEHI_HARI[date.getDay()], namaBulan: MASEHI_BULAN[date.getMonth()], iso: date.toISOString().split('T')[0], string: `${MASEHI_HARI[date.getDay()]}, ${date.getDate()} ${MASEHI_BULAN[date.getMonth()]} ${date.getFullYear()}` };
}

function getNongli(date) {
  try {
    const nl = solarLunar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (!nl || nl === -1) return null;

    // Perbaikan manual karena library mengembalikan undefined di Termux
    const monthCnArr = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
    const dayCnArr = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
    
    const namaBulan = (nl.isLeap ? '闰' : '') + monthCnArr[nl.lMonth - 1] + '月';
    const namaHari = dayCnArr[nl.lDay - 1];

    return { 
      hari: nl.lDay, 
      bulan: nl.lMonth, 
      tahun: nl.lYear, 
      namaBulan: namaBulan, 
      namaHari: namaHari, 
      ganzhi: nl.gzYear, 
      zodiac: nl.animal, 
      string: `${nl.lYear + 551}年 (${nl.gzYear}) ${namaBulan}${namaHari} - Shio ${nl.animal}` 
    };
  } catch (e) { return null; }
}

function getHijriah(date) {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const parts = fmt.formatToParts(date), get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
    return { hari: get('day'), bulan: get('month'), tahun: get('year'), string: `${get('day')} ${HIJRI_BULAN[get('month') - 1]} ${get('year')} H` };
  } catch (e) { return null; }
}

function getJawa(date) {
  const hijri = getHijriah(date); if (!hijri) return null;
  const jdn = toJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const tahunJawa = hijri.tahun + 512, winduIdx = (((tahunJawa - 1555) % 8) + 8) % 8, pasaran = JAWA_PASARAN[(jdn + 3) % 5];
  return { hari: hijri.hari, bulan: hijri.bulan, tahun: tahunJawa, namaHari: JAWA_HARI[date.getDay()], pasaran, namaBulan: JAWA_BULAN[hijri.bulan - 1], namaTahun: JAWA_TAHUN[winduIdx], string: `${JAWA_HARI[date.getDay()]} ${pasaran}, ${hijri.hari} ${JAWA_BULAN[hijri.bulan - 1]} ${tahunJawa} ${JAWA_TAHUN[winduIdx]}` };
}

function formatKalender(date = new Date()) {
  const k = { masehi: getMasehi(date), nongli: getNongli(date), hijriah: getHijriah(date), jawa: getJawa(date) };
  let out = `\n========================================\n       KALENDER TERPADU\n========================================\n\n`;
  out += `Masehi   : ${k.masehi.string}\n\n`;
  if (k.nongli) out += `Nongli   : ${k.nongli.string}\n\n`;
  if (k.hijriah) out += `Hijriah  : ${k.hijriah.string}\n\n`;
  if (k.jawa) out += `Jawa     : ${k.jawa.string}\n`;
  return out;
}

module.exports = { formatKalender, getMasehi, getNongli, getHijriah, getJawa };
