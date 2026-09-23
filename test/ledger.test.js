const ledger = require('@waves/ledger');

test('WavesLedgerSync is exported', () => {
    expect(typeof ledger.WavesLedgerSync).toBe('function');
});