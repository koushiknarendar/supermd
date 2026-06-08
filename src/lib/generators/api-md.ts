// Supports OpenAPI 3.x and Swagger 2.x (JSON only)

interface SchemaObj {
  type?: string
  $ref?: string
  properties?: Record<string, SchemaObj>
  items?: SchemaObj
  required?: string[]
  description?: string
  enum?: unknown[]
  format?: string
  example?: unknown
  allOf?: SchemaObj[]
  oneOf?: SchemaObj[]
  anyOf?: SchemaObj[]
}

interface ParsedParam {
  name: string
  in: string
  type: string
  required: boolean
  description: string
}

interface ParsedResponse {
  code: string
  description: string
  schema?: string
}

interface ParsedEndpoint {
  method: string
  path: string
  summary: string
  description: string
  tags: string[]
  parameters: ParsedParam[]
  requestBody?: string
  responses: ParsedResponse[]
}

interface ParsedApi {
  title: string
  version: string
  description: string
  baseUrl: string
  endpoints: ParsedEndpoint[]
}

function resolveRef(ref: string, root: Record<string, unknown>): SchemaObj | null {
  if (!ref.startsWith("#/")) return null
  const parts = ref.slice(2).split("/")
  let node: unknown = root
  for (const part of parts) {
    if (node && typeof node === "object") {
      node = (node as Record<string, unknown>)[part]
    } else return null
  }
  return node as SchemaObj
}

function schemaToString(schema: SchemaObj | undefined, root: Record<string, unknown>, depth = 0): string {
  if (!schema) return "any"
  if (depth > 3) return "{ ... }"

  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, root)
    if (resolved) return schemaToString(resolved, root, depth)
    return schema.$ref.split("/").pop() ?? "object"
  }

  if (schema.allOf || schema.oneOf || schema.anyOf) {
    const combined = schema.allOf ?? schema.oneOf ?? schema.anyOf ?? []
    const variants = combined.map((s) => schemaToString(s, root, depth)).join(" | ")
    return combined.length > 1 ? `(${variants})` : variants
  }

  if (schema.enum) return `enum(${schema.enum.map(String).join(", ")})`

  if (schema.type === "array" || schema.items) {
    const itemType = schemaToString(schema.items, root, depth)
    return `${itemType}[]`
  }

  if (schema.type === "object" || schema.properties) {
    if (!schema.properties || Object.keys(schema.properties).length === 0) return "object"
    const indent = "  ".repeat(depth + 1)
    const props = Object.entries(schema.properties)
      .slice(0, 12) // cap at 12 props to keep output readable
      .map(([key, val]) => {
        const req = (schema.required ?? []).includes(key) ? "" : "?"
        const t = schemaToString(val, root, depth + 1)
        const d = val.description ? ` // ${val.description}` : ""
        return `${indent}${key}${req}: ${t}${d}`
      })
    const more = Object.keys(schema.properties).length > 12 ? `\n${indent}... (+${Object.keys(schema.properties).length - 12} more)` : ""
    return `{\n${props.join("\n")}${more}\n${"  ".repeat(depth)}}`
  }

  const base = schema.type ?? "any"
  return schema.format ? `${base}(${schema.format})` : base
}

function extractParamsV3(op: Record<string, unknown>, root: Record<string, unknown>): ParsedParam[] {
  const params = (op.parameters as Record<string, unknown>[] | undefined) ?? []
  return params.map((p) => {
    const schema = (p.schema as SchemaObj | undefined) ?? {}
    return {
      name: String(p.name ?? ""),
      in: String(p.in ?? ""),
      type: schemaToString(schema.$ref ? resolveRef(schema.$ref as string, root) ?? schema : schema, root),
      required: Boolean(p.required ?? false),
      description: String(p.description ?? ""),
    }
  })
}

function extractRequestBodyV3(op: Record<string, unknown>, root: Record<string, unknown>): string | undefined {
  const rb = op.requestBody as Record<string, unknown> | undefined
  if (!rb) return undefined
  const content = (rb.content as Record<string, Record<string, unknown>> | undefined) ?? {}
  const mediaType = content["application/json"] ?? content[Object.keys(content)[0]] ?? {}
  const schema = mediaType.schema as SchemaObj | undefined
  if (!schema) return undefined
  return schemaToString(schema, root)
}

function extractResponsesV3(responses: Record<string, Record<string, unknown>>, root: Record<string, unknown>): ParsedResponse[] {
  return Object.entries(responses).map(([code, resp]) => {
    const content = (resp.content as Record<string, Record<string, unknown>> | undefined) ?? {}
    const mediaType = content["application/json"] ?? content[Object.keys(content)[0]] ?? {}
    const schema = mediaType?.schema as SchemaObj | undefined
    return {
      code,
      description: String(resp.description ?? ""),
      schema: schema ? schemaToString(schema, root) : undefined,
    }
  })
}

function parseOpenApi3(root: Record<string, unknown>): ParsedApi {
  const info = (root.info as Record<string, string> | undefined) ?? {}
  const servers = (root.servers as { url?: string }[] | undefined) ?? []
  const paths = (root.paths as Record<string, Record<string, unknown>> | undefined) ?? {}

  const endpoints: ParsedEndpoint[] = []
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (["get", "post", "put", "patch", "delete", "head", "options"].includes(method)) {
        const operation = op as Record<string, unknown>
        endpoints.push({
          method: method.toUpperCase(),
          path,
          summary: String(operation.summary ?? ""),
          description: String(operation.description ?? ""),
          tags: (operation.tags as string[] | undefined) ?? [],
          parameters: extractParamsV3(operation, root),
          requestBody: extractRequestBodyV3(operation, root),
          responses: extractResponsesV3(
            (operation.responses as Record<string, Record<string, unknown>> | undefined) ?? {},
            root
          ),
        })
      }
    }
  }

  return {
    title: info.title ?? "API",
    version: info.version ?? "",
    description: info.description ?? "",
    baseUrl: servers[0]?.url ?? "",
    endpoints,
  }
}

function extractParamsV2(op: Record<string, unknown>, root: Record<string, unknown>): ParsedParam[] {
  const params = (op.parameters as Record<string, unknown>[] | undefined) ?? []
  return params
    .filter((p) => (p.in as string) !== "body")
    .map((p) => ({
      name: String(p.name ?? ""),
      in: String(p.in ?? ""),
      type: String((p as Record<string, string>).type ?? "string"),
      required: Boolean(p.required ?? false),
      description: String(p.description ?? ""),
    }))
}

function extractRequestBodyV2(op: Record<string, unknown>, root: Record<string, unknown>): string | undefined {
  const params = (op.parameters as Record<string, unknown>[] | undefined) ?? []
  const bodyParam = params.find((p) => p.in === "body")
  if (!bodyParam) return undefined
  const schema = bodyParam.schema as SchemaObj | undefined
  return schema ? schemaToString(schema, root) : undefined
}

function parseSwagger2(root: Record<string, unknown>): ParsedApi {
  const info = (root.info as Record<string, string> | undefined) ?? {}
  const host = String(root.host ?? "")
  const basePath = String(root.basePath ?? "")
  const schemes = ((root.schemes as string[] | undefined) ?? ["https"])[0]
  const paths = (root.paths as Record<string, Record<string, unknown>> | undefined) ?? {}

  const endpoints: ParsedEndpoint[] = []
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (["get", "post", "put", "patch", "delete"].includes(method)) {
        const operation = op as Record<string, unknown>
        const responses = (operation.responses as Record<string, Record<string, unknown>> | undefined) ?? {}
        endpoints.push({
          method: method.toUpperCase(),
          path,
          summary: String(operation.summary ?? ""),
          description: String(operation.description ?? ""),
          tags: (operation.tags as string[] | undefined) ?? [],
          parameters: extractParamsV2(operation, root),
          requestBody: extractRequestBodyV2(operation, root),
          responses: Object.entries(responses).map(([code, resp]) => {
            const schema = resp.schema as SchemaObj | undefined
            return {
              code,
              description: String(resp.description ?? ""),
              schema: schema ? schemaToString(schema, root) : undefined,
            }
          }),
        })
      }
    }
  }

  return {
    title: info.title ?? "API",
    version: info.version ?? "",
    description: info.description ?? "",
    baseUrl: host ? `${schemes}://${host}${basePath}` : "",
    endpoints,
  }
}

function renderEndpoint(ep: ParsedEndpoint): string {
  const parts: string[] = []
  parts.push(`### ${ep.method} ${ep.path}`)

  const headline = ep.summary || ep.description
  if (headline) parts.push(headline.trim())

  if (ep.parameters.length > 0) {
    const header = "| Name | In | Type | Required | Description |"
    const sep = "| --- | --- | --- | --- | --- |"
    const rows = ep.parameters.map(
      (p) => `| \`${p.name}\` | ${p.in} | \`${p.type}\` | ${p.required ? "Yes" : "No"} | ${p.description} |`
    )
    parts.push(`**Parameters:**\n\n${[header, sep, ...rows].join("\n")}`)
  }

  if (ep.requestBody) {
    parts.push(`**Request body:**\n\n\`\`\`\n${ep.requestBody}\n\`\`\``)
  }

  const mainResponses = ep.responses.slice(0, 3)
  if (mainResponses.length > 0) {
    const respLines = mainResponses.map((r) => {
      const schemaBlock = r.schema ? `\n\`\`\`\n${r.schema}\n\`\`\`` : ""
      return `**${r.code}:** ${r.description}${schemaBlock}`
    })
    parts.push(respLines.join("\n\n"))
  }

  return parts.join("\n\n")
}

export function generateApiMd(json: string): { markdown: string; endpointCount: number; error?: string } {
  let root: Record<string, unknown>
  try {
    root = JSON.parse(json)
  } catch {
    return { markdown: "", endpointCount: 0, error: "Invalid JSON — paste a valid OpenAPI or Swagger JSON spec." }
  }

  let parsed: ParsedApi
  if (typeof root.swagger === "string" && root.swagger.startsWith("2")) {
    parsed = parseSwagger2(root)
  } else if (root.openapi || root.paths) {
    parsed = parseOpenApi3(root)
  } else {
    return { markdown: "", endpointCount: 0, error: "Unrecognised format — paste an OpenAPI 3.x or Swagger 2.x JSON spec." }
  }

  const parts: string[] = []
  parts.push(`# ${parsed.title} — API Reference\n<!-- Generated by SuperMD · supermd.dev/api-md -->`)

  const meta: string[] = []
  if (parsed.version) meta.push(`**Version:** ${parsed.version}`)
  if (parsed.baseUrl) meta.push(`**Base URL:** \`${parsed.baseUrl}\``)
  if (meta.length) parts.push(meta.join("  \n"))

  if (parsed.description) parts.push(`> ${parsed.description.split("\n")[0].trim()}`)

  // Group by tag if tags present
  const tagged = parsed.endpoints.filter((e) => e.tags.length > 0)
  if (tagged.length > 0 && tagged.length === parsed.endpoints.length) {
    const groups: Record<string, ParsedEndpoint[]> = {}
    for (const ep of parsed.endpoints) {
      const tag = ep.tags[0]
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(ep)
    }
    for (const [tag, eps] of Object.entries(groups)) {
      parts.push(`## ${tag.charAt(0).toUpperCase() + tag.slice(1)}`)
      parts.push(eps.map(renderEndpoint).join("\n\n---\n\n"))
    }
  } else {
    parts.push(`## Endpoints`)
    parts.push(parsed.endpoints.map(renderEndpoint).join("\n\n---\n\n"))
  }

  return {
    markdown: parts.join("\n\n"),
    endpointCount: parsed.endpoints.length,
  }
}
