import React from 'react';

import styles from "./styles.less";

export interface IConnectingProps {
    // ledger: WavesLedgerSync;
    // onLogin: (user: IUser) => void
    // selectedUserId?: number;
}

interface IConnectingState {
    // selectedUser: IUser | null;
    // userList: IUser[];
    // paginationIndex: number;
}

export class ConnectingComponent extends React.Component<IConnectingProps, IConnectingState> {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         selectedUser: null,
    //         userList: [],
    //         paginationIndex: 0
    //     };
    // }

    render() {
        return (
            <div className={styles.container}>
                <div>Подключение...</div>
                <br />
                <div>Подключите устройство Ledger</div>
                <div>Введите ваш pin-code</div>
                <div>Откройте приложение WAVES</div>
            </div>
        );
    }

}
