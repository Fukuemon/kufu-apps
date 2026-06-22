import type * as React from "react";

import { Badge } from "./badge.js";

function Tag(props: React.ComponentProps<typeof Badge>) {
  return <Badge data-slot="tag" {...props} />;
}

export { Tag };
