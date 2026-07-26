# Corporate Site Assets

コーポレートサイトの画像アセットの置き場。**本ディレクトリが正本**であり、design 側に複製を持たない ([ADR-0012](../../../../adr/0012-design-source-of-truth-implementation.md))。

Astro Image / import 経由で参照し、build の asset graph に載せて width / height / lazy loading / format 最適化を効かせる。`public/` への直置きは参照追跡と最適化が弱いため使わない。
