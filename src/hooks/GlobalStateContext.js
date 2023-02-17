import React, { useState } from 'react';

const GlobalStateContext = React.createContext([{}, () => { }]);

const GlobalStateContextProvider = (props) => {
    const [globalState, setGlobalState] = useState(
        {
          balance: 0,
          liability: 0,
          availBalance: 0,
        });
    return (
        <GlobalStateContext.Provider value={[globalState, setGlobalState]}>
            {props.children}
        </GlobalStateContext.Provider>
    );
}
export { GlobalStateContext, GlobalStateContextProvider };
