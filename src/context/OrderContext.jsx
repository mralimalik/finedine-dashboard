import { createContext,useState,useEffect,useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
export const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
  const [orderSettings, setOrderSettings] = useState(null);
  const {selectedVenue} = useContext(AuthContext);


  const getOrderSettings = async (selectedVenue) => {
    try {
      const url = `http://localhost:3000/order/settings/${selectedVenue._id}`;
      const response = await axios.get(url);

      if (response.status === 200) {
        setOrderSettings(response.data?.data || {});
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order settings:", error);
    } finally {
    }
  };

  useEffect(() => {
    if(selectedVenue){
      getOrderSettings(selectedVenue);
    }
  
  }, [selectedVenue])
  
  return <OrderContext.Provider value={{orderSettings,setOrderSettings}}>{children}</OrderContext.Provider>;
};
