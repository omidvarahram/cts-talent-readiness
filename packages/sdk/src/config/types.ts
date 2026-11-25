export interface ConfigManagerOptions {
  minimumAppBuild: number;
  defaultTopLevelReviewerAssociateId: string;
  allowlistedHosts: string[];
}

export interface ConfigManagerValidationResult<TConfig> {
  config: TConfig;
  warnings: string[];
}
