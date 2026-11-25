export interface NavigationPort {
  goBack(): void;
  replace(target: unknown): void;
  reset(target: unknown): void;
}

export interface LinkOpenerPort {
  open(url: string): Promise<void> | void;
}

export interface DialogPort {
  confirm(message: string): Promise<boolean>;
  alert(message: string): Promise<void> | void;
}

export interface ScreenShellPort {
  setTitle(title: string): void;
  setLoading(loading: boolean): void;
}
