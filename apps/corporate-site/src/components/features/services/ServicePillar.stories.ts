import ServicePillar from "./ServicePillar.astro";

const meta = {
  title: "Services/ServicePillar",
  component: ServicePillar,
};

export default meta;

export const Default = {
  args: {
    number: "01",
    title: "営業から加工まで",
    lead: "図面の読み取りから材料手配、精密加工、納品管理までを一貫して支援します。",
  },
};
