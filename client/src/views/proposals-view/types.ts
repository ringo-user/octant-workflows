export interface BackendProposal {
  description: string;
  name: string;
  socialLinks: string[];
  website: string;
}

export interface ExtendedProposal extends BackendProposal {
  isLoadingError: boolean;
}