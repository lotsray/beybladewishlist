const ITEM_OPTIONS = [
  { code: "BB90524", name: "BX-09 戰鬥陀螺X通行證", price: 995 },
  { code: "BB91059", name: "BX-10 極限衝擊戰鬥盤", price: 850 },
  { code: "BB91078", name: "BX-11 X發射器握把", price: 150 },
  { code: "BB91305", name: "BX-18 X旋風發射器", price: 250 },
  { code: "BB91307", name: "BX-20 蒼龍利刃改造組", price: 750 },
  { code: "BB91309", name: "BX-23 鳳凰飛翼 豪華組", price: 495 },
  { code: "BB91446", name: "BX-26 獨角刺心", price: 295 },
  { code: "BB91451", name: "BX-28 旋風發射器 白", price: 250 },
  { code: "BB92670", name: "BX-30 X發射器改造型握把 黑紅", price: 195 },
  { code: "BB91456", name: "BX-34 蒼穹龍騎士 豪華組", price: 495 },
  { code: "BB91457", name: "BX-35 隨機強化組Vol.04", price: 295 },
  { code: "BB95848", name: "BX-41 X發射器改造型握把 黑/透紅", price: 250 },
  { code: "BB95853", name: "BX-42 X發射器改造型握把 藍/透明", price: 250 },
  { code: "BB99761", name: "BX-46 無限盤", price: 2500 },
  { code: "BB08926", name: "BX-51 旋風發射器", price: 250 },
  { code: "BB91050", name: "BXG-01 烈焰飛鳳S", price: 350 },
  { code: "BB93034", name: "BXG-04 銀牙烈虎S", price: 350 },
  { code: "BB94556", name: "BXG-11 堅甲戰熊S", price: 350 },
  { code: "BB93959", name: "CX-01 蒼龍勇氣", price: 495 },
  { code: "BB93962", name: "CX-05 隨機強化組 Vol.6", price: 350 },
  { code: "BB95698", name: "CX-08 隨機強化組 Vol.7", price: 350 },
  { code: "BB09877", name: "CX-11 帝王威能", price: 995 },
  { code: "BB09727", name: "CX-15 邪神狂怒", price: 350 },
  { code: "BB09614", name: "CX-17 隨機強化組 Vol.10", price: 350 },
  { code: "BB09617", name: "CX-18", price: 350 },
  { code: "BB91447", name: "UX-01 蒼龍爆刃", price: 395 },
  { code: "BB91448", name: "UX-02 惡魔戰錘", price: 395 },
  { code: "BB91449", name: "UX-03 魔導神杖", price: 295 },
  { code: "BB91450", name: "UX-04 極限衝擊對戰組U", price: 1995 },
  { code: "BB93949", name: "UX-08 霜輝銀狼", price: 395 },
  { code: "BB93953", name: "UX-09 武士星劍 豪華組", price: 650 },
  { code: "BB93954", name: "UX-10 騎士圓甲改造組", price: 1250 },
  { code: "BB93955", name: "UX-11 衝擊龍神 豪華組", price: 550 },
  { code: "BB93957", name: "UX-13 魔像奇岩", price: 295 },
  { code: "BB95849", name: "UX-14 天蠍長矛", price: 495 },
  { code: "BB98243", name: "UX-15 鮫鯊狂鱗改造組", price: 795 },
  { code: "BB09616", name: "UX-19 子彈獅鷲", price: 550 }
];

function getPriceByName(name) {
  const found = ITEM_OPTIONS.find(item => item.name === name);
  return found ? found.price : 0;
}
