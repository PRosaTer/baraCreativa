declare module 'extract-zip' {
  function extract(source: string, options?: { dir?: string }): Promise<void>;
  export = extract;
}
