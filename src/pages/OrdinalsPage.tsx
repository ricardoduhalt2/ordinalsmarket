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
    <div className="bg-wp-dark/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-gold hover:shadow-gold-hover transition-all duration-300 transform hover:-translate-y-2">
      <div className="p-6 flex flex-col h-full">
        <div className="flex-shrink-0">
          <img 
            src="https://i.imgur.com/YZMKLQj.png"
            alt="Wealth Protocol"
            className="w-16 h-16 mx-auto mb-6"
          />
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-wp-gold text-center">
          {displayTitle}
        </h3>

        {displayImageUrl && inscriptionData?.content_type?.startsWith('image/') && (
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <img 
              src={displayImageUrl} 
              alt={displayTitle} 
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" 
            />
          </div>
        )}

        {displayImageUrl && !inscriptionData?.content_type?.startsWith('image/') && (
          <div className="mb-4 text-center">
            <span className="inline-block px-4 py-2 text-sm bg-wp-gold/10 text-wp-gold rounded-full">
              {inscriptionData?.content_type}
            </span>
          </div>
        )}

        <p className="text-gray-300 mb-6 text-base leading-relaxed">
          {displayDescription}
        </p>

        <div className="mt-auto space-y-4">
          {inscriptionData?.inscription_number && (
            <p className="text-wp-gold/60 text-sm">
              Inscription #{inscriptionData.inscription_number}
            </p>
          )}
          
          {inscriptionData?.owner_address && (
            <p className="text-wp-gold/60 text-sm font-mono break-all">
              {inscriptionData.owner_address.substring(0, 6)}...
              {inscriptionData.owner_address.substring(inscriptionData.owner_address.length - 6)}
            </p>
          )}

          {displayLink && (
            <a 
              href={displayLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full text-center bg-gradient-to-r from-wp-gold to-wp-accent text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
            >
              View Details
            </a>
          )}
        </div>
      </div>
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
        
        if (data) {
          let processedMetadata = {
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
                  })
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
                    })
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
    <div className="min-h-screen bg-gradient-to-br from-black via-wp-dark to-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <img 
            src="https://i.imgur.com/YZMKLQj.png"
            alt="Wealth Protocol"
            className="w-32 h-32 mx-auto mb-8 animate-float"
          />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wp-gold to-wp-accent mb-6">
            ORDINALS Collection
          </h1>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-wp-gold to-wp-accent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-4">
          <div className="h-full">
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
          </div>

          <div className="h-full">
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
          </div>

          <div className="h-full">
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
    </div>
  );
};

export default OrdinalsPage;