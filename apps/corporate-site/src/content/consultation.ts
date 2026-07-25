export const consultationContent = {
  heading: {
    number: "00",
    eyebrow: "CONSULTATION / ご相談内容",
    title: "こんな相談に対応できます",
    description:
      "型番だけ分かっている調達相談から、図面・現物をもとにした別作加工まで。まずは状況を伺い、調達品・代替品・加工方法を整理します。",
  },
  cases: [
    {
      title: "型番は分かるが、手配先が分からない",
      description:
        "機械工具・伝動機器・工場設備機器など、必要な製品の調達先を確認します。",
    },
    {
      title: "既製品では合わず、追加工や別作が必要",
      description:
        "軸穴キー加工、別作ローラー、ゴム・樹脂加工などの加工相談に対応します。",
    },
    {
      title: "工具・機器・加工をまとめて相談したい",
      description:
        "販売と加工の両面から、現場に必要な部品や対応方法を一緒に整理します。",
    },
    {
      title: "交換部品や代替品を探している",
      description:
        "用途・寸法・現物情報から、調達可能な製品や代替案を検討します。",
    },
  ],
  flow: [
    {
      step: "01",
      title: "相談",
      description: "型番・図面・現物・用途を確認します。",
    },
    {
      step: "02",
      title: "調査・提案",
      description: "調達品、代替品、加工方法を検討します。",
    },
    {
      step: "03",
      title: "見積・手配",
      description: "数量・納期・仕様を整理して手配します。",
    },
    {
      step: "04",
      title: "納品",
      description: "工場・事業所への納品まで対応します。",
    },
  ],
} as const;
