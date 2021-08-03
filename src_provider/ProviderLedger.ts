import HwTransportWebusb from '@ledgerhq/hw-transport-webusb';
import {
    AuthEvents,
    ConnectOptions,
    Handler,
    Provider,
    SignerTx,
    SignedTx,
    TypedData,
    UserData,
} from '@waves/signer';
import { IUser, WavesLedgerSync, IWavesLedgerConfig } from '@waves/ledger';
import { IWithId } from '@waves/ts-types';
import { libs, makeTx, makeTxBytes, signTx } from '@waves/waves-transactions';
// import { Waves } from '@waves/ledger/lib/Waves';
import { signerTx2TxParams } from "./helpers";
import {
    getUser as getUserDialog,
    signTx as signTxDialog,
    closeDialog
} from "./ui";
import {
    IProviderLedgerConfig,
} from './ProviderLedger.interface';

type TLong = any;

const DEFAULT_PROVIDER_CONFIG = {
    debug: false,
}

const DEFAULT_WAVES_LEDGER_CONFIG: IWavesLedgerConfig = {
    debug: false,
    openTimeout: 3000,
    listenTimeout: 30000,
    exchangeTimeout: 30000,
    networkCode: 87,
    transport: HwTransportWebusb
};

export class ProviderLedger implements Provider {
    private _providerConfig: IProviderLedgerConfig;
    private _options: ConnectOptions = {
        NETWORK_BYTE: 'W'.charCodeAt(0),
        NODE_URL: 'https://nodes.wavesplatform.com',
    };
    private _wavesLedger: WavesLedgerSync | null;
    private _ledgerConfig: IWavesLedgerConfig;

    public user: IUser | null = null;

    constructor(config?: IProviderLedgerConfig) {
        this._providerConfig = config || DEFAULT_PROVIDER_CONFIG;
        this._ledgerConfig = config?.wavesLedgerConfig || DEFAULT_WAVES_LEDGER_CONFIG;
        this._wavesLedger = null;

        this.__log('constructor');
    }

    public sign(
        list: Array<SignerTx>
    ): Promise<Array<SignedTx<TLong> & IWithId>> {
        this.__log('sign', list);

        return Promise.all(
            list.map((tx: any): Promise<any> => {
                signTxDialog(tx);

                const txParams = signerTx2TxParams(tx);

                const dataBuffer = makeTxBytes({
                    ...txParams,
                    senderPublicKey: (this.user?.publicKey as string),
                });

                const data2sign = {
                    dataType: txParams.type,
                    dataVersion: txParams.version,
                    dataBuffer: dataBuffer,
                    amountPrecision: 0,
                    amount2Precision: 0,
                    feePrecision: 0,
                    // amountPrecision: tx.amountPrecision ?? null,
                    // amount2Precision: tx.amount2Precision ?? null,
                    // feePrecision: tx.feePrecision ?? null,
                };

                return this._wavesLedger!.signTransaction(this.user!.id, data2sign)
                    .then((tx) => {
                        closeDialog();
                        return tx;
                    });
            })
        ) as any;
    }

    public signTypedData(data: Array<TypedData>): Promise<string> {
        this.__log('signTypedData');

        console.error('Not implemented');
        return Promise.resolve('/* TODO */');
    }

    public signMessage(data: string | number): Promise<string> {
        this.__log('signMessage');

        console.error('Not implemented');
        return Promise.resolve('/* TODO */');
    }

    public connect(options: ConnectOptions): Promise<void> {
        this.__log('connect', options);

        this._options = options;

        return Promise.resolve();
    }

    public login(): Promise<UserData> {
        this.__log('login');

        return this.initWavesLedger()
            .then(async () => {
                const user: IUser = await getUserDialog(this._wavesLedger!);

                this.user =  user;

                return (user as UserData);
            });
    }

    public logout(): Promise<void> {
        this.__log('logout');

        return Promise.resolve();
    }

    public on<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        this.__log('on');
        console.error('Not implemented');
        return this;
    }

    public once<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider{
        this.__log('once');
        console.error('Not implemented');
        return this;
    };

    public off<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>,
    ): Provider {
        this.__log('off');
        console.error('Not implemented');
        return this;
    }

    private initWavesLedger(): Promise<void> {
        this.__log('initWavesLedger');

        if (!this._wavesLedger) {
            this._wavesLedger = new WavesLedgerSync(this._ledgerConfig);

            return this._wavesLedger.tryConnect();
        } else {
            return Promise.resolve();
        }
    }

    private __log(tag: string, ...args) {
        if (this._providerConfig.debug) {
            console.log(`ProviderLedger :: ${tag} `, ...args);
        }
    }
}