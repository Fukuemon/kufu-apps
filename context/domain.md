---
type: context
title: 業務の知識
description: コーポレートサイト、app、package、island、セマンティックトークンの用語と、コードの識別子との対応。状態と不変条件を持つ概念は未定
status: draft
---

# 業務の知識

## Glossary

- コーポレートサイト: Kufu のマーケティングのサイト。`apps/corporate-site` が当たる。
- app: `apps/*` の配下の実行の単位。
- package: `packages/*` の配下の、共有の UI、設定、ライブラリ。
- island: Astro のページの中で、部分的に hydrate する単位。`client:*` を付けたコンポーネントが当たる。
  - 最小限に保つ。基準は [codebase.md](codebase.md#shadcn-の使い方と-react-island-の境界) にある。
- セマンティックトークン: `@kufu/ui` の `tokens.css` と `globals.css` で定義するデザイントークン。`--primary` のような役割の名前を持つ。
  - 実装のコードに値を直接書かず、セマンティックトークンを参照する。

## Concepts

状態や不変条件を持つ業務の概念は未定。
