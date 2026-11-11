import { Badge, type BadgeProps } from "./badge.js";

/** 事業の分類や入力の項目に添える印。見た目は Badge と同じである。 */
function Tag(props: BadgeProps) {
  return <Badge data-slot="tag" {...props} />;
}

export { Tag };
