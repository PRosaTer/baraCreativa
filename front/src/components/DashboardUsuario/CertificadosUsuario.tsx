'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';


interface CertificatesContextType {
  refreshCertificates: () => void; 
}


const CertificatesContext = createContext<CertificatesContextType | undefined>(undefined);


interface CertificatesProviderProps {
  children: ReactNode; 
}


export const CertificatesProvider: React.FC<CertificatesProviderProps> = ({ children }) => {

  const [version, setVersion] = useState(0);

  
  const refreshCertificates = useCallback(() => {
    setVersion(prevVersion => prevVersion + 1);
  }, []);

  const contextValue = {
    refreshCertificates,
  };

  return (
    <CertificatesContext.Provider value={contextValue}>
      {children}
    </CertificatesContext.Provider>
  );
};


export const useCertificates = () => {
  const context = useContext(CertificatesContext);
  if (context === undefined) {
    throw new Error('useCertificates debe usarse dentro de un CertificatesProvider');
  }
  return context;
};
