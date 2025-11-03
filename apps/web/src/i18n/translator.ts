// apps/web/src/i18n/translator.ts
export type MessageValue = string | MessageTree;

export type MessageTree = {
  [key: string]: MessageValue;
};

export type TranslationValues = Record<string, string | number>;

function isRecord(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMessage(messages: MessageTree, key: string): string | undefined {
  const segments = key.split(".");
  let current: MessageValue | undefined = messages;

  for (const segment of segments) {
    if (!isRecord(current)) {
      return undefined;
    }
    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
}

function formatMessage(template: string, values?: TranslationValues) {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, variable) => {
    const value = values[variable];
    if (value === undefined || value === null) {
      return match;
    }
    return String(value);
  });
}

export type Translator = (key: string, values?: TranslationValues) => string;

export function createTranslator(
  messages: MessageTree,
  namespace?: string,
): Translator {
  return (key, values) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = getMessage(messages, fullKey);
    if (!message) {
      // 返回 key 方便排查缺失的文案
      return fullKey;
    }
    return formatMessage(message, values);
  };
}
