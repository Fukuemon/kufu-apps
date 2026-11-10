# Corporate Site Assets

コーポレートサイトの画像アセットの置き場。**本ディレクトリが唯一の基準**であり、design 側に複製を持たない ([ADR-0012](../../../../docs/adr/0012-design-source-of-truth-implementation.md))。

Astro Image / import 経由で参照し、build の asset graph に載せて width / height / lazy loading / format 最適化を適用する。`public/` への直置きは参照追跡と最適化が弱いため使わない。
