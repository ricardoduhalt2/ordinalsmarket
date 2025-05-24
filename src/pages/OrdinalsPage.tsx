import React, { useState, useEffect } from 'react';
import { getInscriptionData } from '../utils/ordiscanApi';
import type { InscriptionData } from '../types.ts';

interface OrdinalCardProps {
  inscriptionData?: any;
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

const OrdinalCard: React.FC<OrdinalCardProps> = ({ inscriptionData, title, description, imageUrl, link }) => {
  const displayTitle = inscriptionData?.metadata?.name || title || `Inscription #${inscriptionData?.inscription_number}`;
  const displayDescription = inscriptionData?.metadata?.description || description || 'No description available.';
  const displayImageUrl = inscriptionData?.content_url || imageUrl;
  const displayLink = inscriptionData?.content_url || link;

  return (
    <div className="card-tilt h-full bg-glass backdrop-blur-md p-8 rounded-2xl shadow-lg text-white flex flex-col items-center text-center border border-amber-500/20 hover:border-amber-400 transition-all duration-300 transform hover:scale-102 hover:shadow-amber">
      <img 
        src="https://i.imgur.com/YZMKLQj.png"
        alt="Wealth Protocol"
        className="w-24 h-24 mb-6 transition-transform duration-300 transform group-hover:scale-110"
      />
      <h3 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
        {displayTitle}
      </h3>
      {displayImageUrl && inscriptionData?.content_type?.startsWith('image/') && (
        <img 
          src={displayImageUrl} 
          alt={displayTitle} 
          className="w-full h-48 object-cover rounded-xl mb-6 border-2 border-amber-500/30 shadow-lg hover:shadow-amber transition-all duration-300" 
        />
      )}
      {displayImageUrl && !inscriptionData?.content_type?.startsWith('image/') && (
        <p className="text-amber-400 mb-4 font-mono text-sm bg-dark-bg/50 px-4 py-2 rounded-full border border-amber-500/20">
          Content Type: {inscriptionData?.content_type}
        </p>
      )}
      <p className="text-amber-100 mb-6 text-lg leading-relaxed flex-grow">{displayDescription}</p>
      {inscriptionData?.inscription_number && (
        <p className="text-amber-300/80 text-sm mb-2 font-mono">Inscription #: {inscriptionData.inscription_number}</p>
      )}
      {inscriptionData?.owner_address && (
        <p className="text-amber-300/80 text-sm mb-4 font-mono">
          Owner: {inscriptionData.owner_address.substring(0, 6)}...{inscriptionData.owner_address.substring(inscriptionData.owner_address.length - 6)}
        </p>
      )}
      {displayLink && (
        <a 
          href={displayLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-8 rounded-full mt-auto hover:shadow-amber transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-dark-bg"
        >
          View Content
        </a>
      )}
    </div>
  );
};

const OrdinalsPage: React.FC = () => {
  const [chidoData, setChidoData] = useState<InscriptionData | null>(null);
  const [kimonoData, setKimonoData] = useState<InscriptionData | null>(null);
  const [tracksuitData, setTracksuitData] = useState<InscriptionData | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    chido: true,
    kimono: true,
    tracksuit: true
  });
  const [errors, setErrors] = useState({
    chido: null as string | null,
    kimono: null as string | null,
    tracksuit: null as string | null
  });

  useEffect(() => {
    const fetchInscription = async (id: string, type: 'chido' | 'kimono' | 'tracksuit') => {
      try {
        setLoadingStates(prev => ({ ...prev, [type]: true }));
        const data = await getInscriptionData(id);
        console.log(`${type} data:`, data);
        
        if (data) {
          let processedMetadata: { 
            name: string;
            description: string;
            attributes: Array<{ trait_type: string; value: any }>;
          } = {
            name: "Unnamed",
            description: "No description",
            attributes: []
          };
          
          if (typeof data.metadata === 'object' && data.metadata !== null) {
            processedMetadata = {
              name: (data.metadata.name?.toString()) || "Unnamed",
              description: (data.metadata.description?.toString()) || "No description",
              attributes: Array.isArray(data.metadata.attributes) 
                ? data.metadata.attributes.map((attr: unknown) => {
                    if (typeof attr === 'object' && attr !== null && 'trait_type' in attr && 'value' in attr) {
                      return attr;
                    }
                    return { 
                      trait_type: typeof attr === 'string' ? attr : 'attribute', 
                      value: typeof attr === 'string' || typeof attr === 'number' ? attr : 'unknown' 
                    };
                  }) as Array<{ trait_type: string; value: any }>
                : []
            };
          } else if (typeof data.metadata === 'string') {
            try {
              const parsed = JSON.parse(data.metadata);
              processedMetadata = {
                name: (parsed.name?.toString()) || "Unnamed",
                description: (parsed.description?.toString()) || "No description",
                attributes: Array.isArray(parsed.attributes) 
                  ? parsed.attributes.map((attr: unknown) => {
                      if (typeof attr === 'object' && attr !== null && 'trait_type' in attr && 'value' in attr) {
                        return attr;
                      }
                      return { 
                        trait_type: typeof attr === 'string' ? attr : 'attribute',
                        value: typeof attr === 'string' || typeof attr === 'number' ? attr : 'unknown'
                      };
                    }) as Array<{ trait_type: string; value: any }>
                  : []
              };
            } catch (e) {
              processedMetadata.description = data.metadata;
            }
          }
          
          const standardizedData = {
            ...data,
            metadata: processedMetadata
          };
          
          if (type === 'chido') setChidoData(standardizedData);
          if (type === 'kimono') setKimonoData(standardizedData);
          if (type === 'tracksuit') setTracksuitData(standardizedData);
        } else {
          setErrors(prev => ({ 
            ...prev, 
            [type]: `Failed to fetch ${type} data.`
          }));
        }
      } catch (err) {
        setErrors(prev => ({ 
          ...prev, 
          [type]: `An error occurred while fetching ${type} data.`
        }));
        console.error(err);
      } finally {
        setLoadingStates(prev => ({ ...prev, [type]: false }));
      }
    };

    Promise.all([
      fetchInscription('96587318', 'chido'),
      fetchInscription('96591617', 'kimono'),
      fetchInscription('96591705', 'tracksuit')
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <img 
            src="https://i.imgur.com/YZMKLQj.png"
            alt="Wealth Protocol"
            className="w-32 h-32 sm:w-40 sm:h-40"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
          ORDINALS Collection
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loadingStates.kimono ? (
            <OrdinalCard title="Bitcoin Drip Kimono" description="Loading data..." />
          ) : errors.kimono ? (
            <OrdinalCard title="Bitcoin Drip Kimono" description={errors.kimono} />
          ) : kimonoData ? (
            <OrdinalCard inscriptionData={kimonoData} />
          ) : (
            <OrdinalCard 
              title="Bitcoin Drip Kimono" 
              description="No data available" 
              link="https://ordiscan.com/inscription/96591617"
            />
          )}

          {loadingStates.tracksuit ? (
            <OrdinalCard title="BTC tracksuit" description="Loading data..." />
          ) : errors.tracksuit ? (
            <OrdinalCard title="BTC tracksuit" description={errors.tracksuit} />
          ) : tracksuitData ? (
            <OrdinalCard inscriptionData={tracksuitData} />
          ) : (
            <OrdinalCard 
              title="BTC tracksuit" 
              description="No data available" 
              link="https://ordiscan.com/inscription/96591705"
            />
          )}

          {loadingStates.chido ? (
            <OrdinalCard title="C.H.I.D.O." description="Loading data..." />
          ) : errors.chido ? (
            <OrdinalCard title="C.H.I.D.O." description={errors.chido} />
          ) : chidoData ? (
            <OrdinalCard inscriptionData={chidoData} />
          ) : (
            <OrdinalCard 
              title="C.H.I.D.O." 
              description="No data available" 
              link="https://ordiscan.com/inscription/96587318"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdinalsPage;