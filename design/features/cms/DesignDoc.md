---
type: feature-design
title: CMS の app の候補
description: コーポレートサイトに掲載する投稿を管理する app（apps/cms）の候補。React の app の暫定の標準の候補と、採るときの条件
status: draft
---

# CMS の app の候補

## Overview

`apps/cms` は、コーポレートサイトに掲載する投稿を管理する app の候補である。  
Phase 1 では実装せず、React の app の暫定の標準の候補と、それを採るときの条件だけを置く。  
ADR-0003: [Phase 1 は corporate-site だけを実装する](../../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md)

全体像は [design/DesignDoc.md](../../DesignDoc.md) に、立ち上げるかの判断の条件は [PRD の Open Questions](../../../PRD.md#open-questions) にある。  
実装に着手するときに、spec と ADR で採否、バージョン、互換性、運用の責務を確認し直して決める。

## Scope

持つものは次のとおり。

- React の app の暫定の標準の候補と、それぞれを採る条件
- 状態の置き場の原則

持たないものは次のとおり。

- CMS と API、認証、管理画面の実装
- CMS が要ると判断する基準が固まる前の app の追加
- Phase 1 の時点で、特定の React のライブラリを戻せない形で採ること

## Design

### React の app の暫定の標準の候補

暫定の候補は spec の入力で、いまの実装の指示ではない。

| 領域           | 暫定の候補      | 採る条件と、確認し直すこと                                                                                            |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Routing        | TanStack Router | URL で表せる状態を route の状態に置けること。spec を始めるときに、最新版の API と、SSR と deployment の前提を確認する |
| Server state   | TanStack Query  | CMS と API のキャッシュ、mutation、invalidation の要求があること。単純な静的な内容の管理で不要なら入れない            |
| Form           | React Hook Form | 投稿の編集、問い合わせの管理、認証のように、複数のフォームが具体的になったときに採る                                  |
| Client state   | Zustand         | URL、server の状態、コンポーネントの中の状態で表せない横断の状態が具体的になったときに限る                            |
| React の最適化 | React Compiler  | 採る時点の公式の互換性を確認する。対応しないライブラリと実装のパターンがあれば、spec か ADR で回避の方法を決める      |

- 追加のライブラリ（axios など）は、標準の Web API、framework の機能、TanStack Query で足りない理由を spec に書いたときだけ採る。
- URL で表せる状態は router の側に置く。状態の置き場の規則は [context/codebase.md](../../../context/codebase.md#state-ownership) にある。

### 内容の管理

- コーポレートサイトの内容を CMS へ移す時期と、内容の更新の責務とレビューの観点は、実装に着手するときの spec で決める。
- 認証、権限、公開の流れ、プレビューの環境のセキュリティの要件は、[context/operations.md](../../../context/operations.md#secrets) を踏まえて spec で設計する。

### 採るときに残すもの

- `apps/cms` を足すときは、暫定の候補の採否の理由、バージョン、互換性を確認した結果を spec か ADR に残す。
- CMS と API を入れるときは、ADR と spec を先に作る。

## Interface

未定。
