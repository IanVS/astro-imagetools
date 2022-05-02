// @ts-check
import { cwd } from "../../utils/runtimeChecks.js";

export default async function getSrcset(src, breakpoints, format, options) {
  options = {
    format,
    w: breakpoints,
    ...options,
  };

  const keys = Object.keys(options);

  const params = keys.length
    ? keys
        .map((key) =>
          Array.isArray(options[key])
            ? `&${key}=${options[key].join(";")}`
            : `&${key}=${options[key]}`
        )
        .join("")
    : "";

  const id = `${src}?${params.slice(1)}`;

  if (process.env.npm_lifecycle_event !== "dev") {
    const fullPath = cwd + id;

    const { default: load } = await import("../../plugin/hooks/load.js");

    const srcset = (await load(fullPath)).slice(16).slice(0, -1);

    return srcset;
  }

  const srcset = (await import(id)).default;

  return srcset;
}
