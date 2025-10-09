declare module "quicklink" {
  export interface QuicklinkOptions {
    el?: HTMLElement | Document;
    urls?: string[];
    timeout?: number;
    throttle?: number;
    limit?: number;
    origins?: string[] | boolean;
    ignores?: Array<
      RegExp | ((uri: string, elem?: HTMLAnchorElement) => boolean)
    >;
    priority?: boolean;
  }

  export function listen(options?: QuicklinkOptions): () => void;
  export function prefetch(
    urls: string | string[],
    options?: QuicklinkOptions,
  ): Promise<void>;
}
