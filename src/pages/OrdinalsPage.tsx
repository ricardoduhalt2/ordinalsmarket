import React, { useState, useEffect } from 'react';
import { getInscriptionData } from '../utils/ordiscanApi';
import type { InscriptionData } from '../types.ts';

interface OrdinalCardProps {
  inscriptionData?: any; // Full inscription data
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

const OrdinalCard: React.FC<OrdinalCardProps> = ({ inscriptionData, title, description, imageUrl, link }) => {
  const displayTitle = inscriptionData?.metadata?.name || title || `Inscription #${inscriptionData?.inscription_number}`;
  const displayDescription = inscriptionData?.metadata?.description || description || 'No description available.';
  const displayImageUrl = inscriptionData?.content_url || imageUrl;
  const displayLink = inscriptionData?.content_url || link; // Use content_url as link if available

  return (
      <div className="bg-dark-bg p-6 rounded-xl shadow-lg text-white flex flex-col items-center text-center border border-neon-blue/20 hover:border-neon-blue transition-all duration-300 transform hover:scale-105 hover:shadow-neon-blue/50 hover:shadow-lg">
        <h3 className="text-2xl font-extrabold mb-3 neon-text bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">{displayTitle}</h3>
      {displayImageUrl && inscriptionData?.content_type?.startsWith('image/') && (
        <img src={displayImageUrl} alt={displayTitle} className="w-40 h-40 object-cover rounded-lg mb-5 border-2 border-neon-purple/30 shadow-lg hover:shadow-neon-blue/50 hover:scale-105 transition-all duration-300" />
      )}
      {displayImageUrl && !inscriptionData?.content_type?.startsWith('image/') && (
        <p className="text-neon-blue mb-3 font-mono text-sm bg-dark-bg px-3 py-1 rounded-full">Content Type: {inscriptionData?.content_type}</p>
      )}
      <p className="text-neon-blue mb-5 text-lg leading-relaxed">{displayDescription}</p>
      {inscriptionData?.inscription_number && (
        <p className="text-neon-purple/80 text-sm mb-2 font-mono">Inscription #: {inscriptionData.inscription_number}</p>
      )}
      {inscriptionData?.owner_address && (
        <p className="text-neon-purple/80 text-sm mb-4 font-mono">Owner: {inscriptionData.owner_address.substring(0, 6)}...{inscriptionData.owner_address.substring(inscriptionData.owner_address.length - 6)}</p>
      )}
      {displayLink && (
        <a href={displayLink} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-2 px-6 rounded-full mt-4 hover:shadow-lg hover:shadow-neon-blue/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-pulse-slow">
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
          // Handle metadata type variations with explicit typing
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
                  // Convert flat values to proper attribute objects
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
              // Attempt to parse string metadata as JSON
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
              // If parsing fails, treat as plain text description
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

    // Fetch all inscriptions in parallel
    Promise.all([
      fetchInscription('96587318', 'chido'),   // C.H.I.D.O.
      fetchInscription('96591617', 'kimono'),  // Bitcoin Drip Kimono
      fetchInscription('96591705', 'tracksuit') // BTC tracksuit
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 neon-text bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">ORDINALS Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Bitcoin Drip Kimono */}
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

        {/* BTC tracksuit */}
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
        {/* C.H.I.D.O. */}
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
  );
};

export default OrdinalsPage;
