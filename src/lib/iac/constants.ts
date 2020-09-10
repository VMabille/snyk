export type IacProjectTypes = 'k8sconfig' | 'helmconfig' | 'terraformconfig';
export type IacFileTypes = 'yaml' | 'yml' | 'json' | 'tf';

export enum IacProjectType {
  K8s = 'k8sconfig',
  Terraform = 'terraformconfig',
}

export const TEST_SUPPORTED_IAC_PROJECTS: IacProjectTypes[] = [
  IacProjectType.K8s,
  IacProjectType.Terraform,
];

export const projectTypeByFileType = {
  yaml: IacProjectType.K8s,
  yml: IacProjectType.K8s,
  tf: IacProjectType.Terraform,
};

export type IacValidateTerraformResponse = {
  body?: {
    isValidTerraformFile: boolean;
    reason: string;
  };
};
