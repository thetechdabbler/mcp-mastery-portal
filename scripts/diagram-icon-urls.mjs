/**
 * Icon URLs for D2 `icon:` fields. Heroicons outline via jsDelivr (D2 can bundle these reliably).
 * When authoring new diagrams, reuse these roles for visual consistency.
 */
const HERO = (/** @type {string} */ name) =>
  `https://cdn.jsdelivr.net/npm/heroicons@2.1.1/24/outline/${name}.svg`;

/** @type {Record<string, string>} */
export const ROLE_ICONS = {
  host: HERO("computer-desktop"),
  model: HERO("cpu-chip"),
  mcpClient: HERO("arrows-right-left"),
  mcpServer: HERO("server-stack"),
  transportStdio: HERO("command-line"),
  transportHttp: HERO("globe-alt"),
  transportSse: HERO("signal"),
  tool: HERO("wrench-screwdriver"),
  resource: HERO("document-text"),
  prompt: HERO("chat-bubble-left-right"),
  database: HERO("circle-stack"),
  queue: HERO("queue-list"),
  policy: HERO("shield-check"),
  audit: HERO("clipboard-document-list"),
  malicious: HERO("bug-ant"),
  user: HERO("user-circle"),
  loadBalancer: HERO("arrows-pointing-out"),
  backend: HERO("building-office-2"),
  authz: HERO("lock-closed"),
  observability: HERO("chart-bar-square"),
  testRunner: HERO("play-circle"),
  harness: HERO("beaker"),
  catalog: HERO("rectangle-group"),
  incident: HERO("exclamation-triangle"),
  approval: HERO("clipboard-document-check"),
  writePlane: HERO("pencil-square"),
  readPlane: HERO("book-open"),
  pathInput: HERO("folder-open"),
  normalize: HERO("adjustments-horizontal"),
  reject: HERO("x-circle"),
  readOk: HERO("check-circle"),
  metadata: HERO("tag"),
  planner: HERO("light-bulb"),
  lowTrust: HERO("arrow-down-circle"),
  highPrivilege: HERO("bolt"),
  progress: HERO("arrow-path"),
  cancel: HERO("stop-circle"),
  capstoneCode: HERO("code-bracket-square"),
  capstoneDocs: HERO("document-duplicate"),
};
