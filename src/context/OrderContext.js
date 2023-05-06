/* import React, { createContext } from 'react';
let state ={
    "pickup":"ikoyi",
    "dropoff": "anthony"
}
const OrderContext = createContext({
  status: 'NONE',
  updateOrder: (data) => {
    state = {...state, data}
  },
  order: state
});

export default OrderContext; */

import React from 'react';

// The Context 
const TemplateContext = React.createContext({});

// Template Provider
const TemplateProvider = ({children}) => {

    const [myOrder, setMyOrder] = React.useState({});

    // Context values passed to consumer
    const order = {
        myOrder,    // <------ Expose Value to Consumer
        setMyOrder  // <------ Expose Setter to Consumer
    };

    return (
        <TemplateContext.Provider value={order}>
            {children}
        </TemplateContext.Provider>
    )
}

// Template Consumer
const TemplateConsumer = ({children}) => {
    return (
        <TemplateContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error('TemplateConsumer must be used within TemplateProvider');
                }
                return children(context)
            }}
        </TemplateContext.Consumer>
    )
}

// useTemplate Hook
const useTemplate = () => {
    const context = React.useContext(TemplateContext);
    if(context === undefined)
        throw new Error('useTemplate must be used within TemplateProvider');
    return context;
}

export {
    TemplateProvider,
    TemplateConsumer,
    useTemplate
}