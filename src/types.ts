export interface InscriptionData {
  inscription_id: string;
  inscription_number: number;
  content_url: string;
  content_type: string;
  owner_address: string;
  metadata: {
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  } | string | null;
}
