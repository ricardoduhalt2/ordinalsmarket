import { Ordiscan } from 'ordiscan';

const API_KEY = import.meta.env.VITE_ORDISCAN_API_KEY;

if (!API_KEY) {
  console.error("Ordiscan API key is not defined in environment variables.");
}

const ordiscan = new Ordiscan(API_KEY);

export const getInscriptionData = async (inscriptionId: string) => {
  try {
    const data = await ordiscan.inscription.getInfo(inscriptionId);
    return data;
  } catch (error) {
    console.error(`Error fetching inscription data for ${inscriptionId}:`, error);
    return null;
  }
};

export const getInscriptionsList = async () => {
  try {
    const data = await ordiscan.inscription.list();
    return data;
  } catch (error) {
    console.error(`Error fetching inscriptions list:`, error);
    return null;
  }
};

export const getInscriptionTraits = async (inscriptionId: string) => {
  try {
    const data = await ordiscan.inscription.getTraits({ inscriptionId });
    return data;
  } catch (error) {
    console.error(`Error fetching inscription traits for ${inscriptionId}:`, error);
    return null;
  }
};

export const getRunesList = async () => {
  try {
    const data = await ordiscan.rune.list();
    return data;
  } catch (error) {
    console.error(`Error fetching runes list:`, error);
    return null;
  }
};

export const getBrc20List = async (page: number = 1) => {
  try {
    const data = await ordiscan.brc20.list({ page });
    return data;
  } catch (error) {
    console.error(`Error fetching BRC-20 list:`, error);
    return null;
  }
};

export const getBrc20TokenInfo = async (tick: string) => {
  try {
    const data = await ordiscan.brc20.getInfo({ name: tick });
    return data;
  } catch (error) {
    console.error(`Error fetching BRC-20 token info for ${tick}:`, error);
    return null;
  }
};

export const getCollectionsList = async (page: number = 1) => {
  try {
    const data = await ordiscan.collection.list({ page });
    return data;
  } catch (error) {
    console.error(`Error fetching collections list:`, error);
    return null;
  }
};

export const getAddressInscriptions = async (bitcoinAddress: string, page: number = 1) => {
  try {
    const data = await ordiscan.address.getInscriptions({ address: bitcoinAddress, page });
    return data;
  } catch (error) {
    console.error(`Error fetching inscriptions for address ${bitcoinAddress}:`, error);
    return null;
  }
};

export const getAddressRunesBalance = async (bitcoinAddress: string) => {
  try {
    const data = await ordiscan.address.getRunes({ address: bitcoinAddress });
    return data;
  } catch (error) {
    console.error(`Error fetching runes balance for address ${bitcoinAddress}:`, error);
    return null;
  }
};
