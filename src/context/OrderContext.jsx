import { createContext } from "react";

export const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
    
  return <OrderContext.Provider value={{}}>{children}</OrderContext.Provider>;
};
