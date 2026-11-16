// =====================================================================
// 1. ALGORITMA KALENDER TIONGHOA MURNI (TANPA LIBRARY)
// =====================================================================
const lunarInfo = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
];
const Gan = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const Zhi = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const Animals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
const nStr1 = ['日','一','二','三','四','五','六','七','八','九','十'];
const nStr2 = ['初','十','廿','卅'];
const monthNames = ["正","二","三","四","五","六","七","八","九","十","冬","腊"];

function lYearDays(y) { let i, sum = 348; for (i = 0x8000; i > 0x8; i >>= 1) { sum += (lunarInfo[y - 1900] & i) ? 1 : 0; } return (sum + leapDays(y)); }
function leapMonth(y) { return (lunarInfo[y - 1900] & 0xf); }
function leapDays(y) { if (leapMonth(y)) { return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29); } return 0; }
function monthDays(y, m) { return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29); }

function solarToLunar(y, m, d) {
  let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
  let i, temp = 0;
  for (i = 1900; i < 2101 && offset > 0; i++) { temp = lYearDays(i); offset -= temp; }
  if (offset < 0) { offset += temp; i--; }
  const year = i;
  let leap = leapMonth(year);
  let isLeap = false;
  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === (leap + 1) && isLeap === false) { --i; isLeap = true; temp = leapDays(year); } 
    else { temp = monthDays(year, i); }
    if (isLeap === true && i === (leap + 1)) isLeap = false;
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && i === leap + 1) { if (isLeap) { isLeap = false; } else { isLeap = true; --i; } }
  if (offset < 0) { offset += temp; --i; }
  
  const month = i;
  const day = offset + 1;
  let mCn = (isLeap ? "闰" : "") + monthNames[month - 1] + "月";
  let dCn = (day === 10) ? "初十" : (day === 20) ? "二十" : (day === 30) ? "三十" : nStr2[Math.floor(day / 10)] + nStr1[day % 10];
  const gzYear = Gan[(year - 4) % 10] + Zhi[(year - 4) % 12];
  const shio = Animals[(year - 4) % 12];
  const tahunKongzili = year + 551;

  return `${tahunKongzili}年 (${gzYear}) ${mCn}${dCn} - Shio ${shio}`;
}

// =====================================================================
// 2. KALENDER LAINNYA (MASEHI, HIJRIAH, JAWA)
// =====================================================================
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
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();

  // 1. Masehi
  const masehiStr = `${MASEHI_HARI[date.getDay()]}, ${d} ${MASEHI_BULAN[m - 1]} ${y}`;
  
  // 2. Nongli
  let nongliStr = "Error";
  try { nongliStr = solarToLunar(y, m, d); } catch(e) {}

  // 3. Hijriah
  let hijriahStr = "Error", hijriDay, hijriMonth, hijriYear;
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const parts = fmt.formatToParts(date), get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
    hijriDay = get('day'); hijriMonth = get('month'); hijriYear = get('year');
    hijriahStr = `${hijriDay} ${HIJRI_BULAN[hijriMonth - 1]} ${hijriYear} H`;
  } catch (e) {}

  // 4. Jawa
  let jawaStr = "Error";
  if (hijriDay) {
    const jdn = toJDN(y, m, d);
    const tahunJawa = hijriYear + 512;
    const winduIdx = (((tahunJawa - 1555) % 8) + 8) % 8;
    const pasaran = JAWA_PASARAN[(jdn + 3) % 5];
    jawaStr = `${JAWA_HARI[date.getDay()]} ${pasaran}, ${hijriDay} ${JAWA_BULAN[hijriMonth - 1]} ${tahunJawa} ${JAWA_TAHUN[winduIdx]}`;
  }

  return { masehi: masehiStr, nongli: nongliStr, hijriah: hijriahStr, jawa: jawaStr };
}