import CompanySection from "./CompanySection.astro";

// VRT の撮影対象から外している。並列実行時にページの load 状態が完了せず、
// screenshot() の waitForLoadState が切れる (単独実行なら 942ms で通る)。
// 原因は未特定で、別 issue で扱う。地図を含むこのセクションは route 側 VRT の
// `/` 全面撮影でも見えているため、視覚回帰の検出が完全に抜けるわけではない。
const screenshot = { skip: false };

const meta = {
  title: "Sections/Company/CompanySection",
  component: CompanySection,
  parameters: { screenshot },
};

export default meta;

export const Default = {
  args: { number: "03" },
};
