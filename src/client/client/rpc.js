"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const rpc_client_1 = require("../lib/rpc_client");
class HostClient {
    constructor(options) {
        this.m_logger = options.logger;
        this.m_client = new rpc_client_1.RPCClient(options.host, options.port, this.m_logger);
    }
    async getBlock(params) {
        let cr = await this.m_client.callAsync('getBlock', params);
        if (cr.ret !== 200) {
            return { err: core_1.ErrorCode.RESULT_FAILED };
        }
        return JSON.parse(cr.resp);
    }
    async getTransactionReceipt(params) {
        let cr = await this.m_client.callAsync('getTransactionReceipt', params);
        if (cr.ret !== 200) {
            return { err: core_1.ErrorCode.RESULT_FAILED };
        }
        return JSON.parse(cr.resp);
    }
    async getNonce(params) {
        let cr = await this.m_client.callAsync('getNonce', params);
        if (cr.ret !== 200) {
            return { err: core_1.ErrorCode.RESULT_FAILED };
        }
        return JSON.parse(cr.resp);
    }
    async sendTransaction(params) {
        let writer = new core_1.BufferWriter();
        let err = params.tx.encode(writer);
        if (err) {
            this.m_logger.error(`send invalid transactoin`, params.tx);
            return { err };
        }
        console.log('111:',writer.render());
        let cr = await this.m_client.callAsync('sendTransaction', { tx: writer.render() });
        console.log(cr)
        if (cr.ret !== 200) {
            //this.m_logger.error(`send tx failed ret `, cr.ret);
            return { err: core_1.ErrorCode.RESULT_FAILED };
        }
        return { err: JSON.parse(cr.resp) };
    }
<<<<<<< HEAD
	async sendTransactionByRender(render) {
        console.log('222:',render);
		let cr = await this.m_client.callAsync('sendTransaction', { tx: render });
		console.log(cr)
		if (cr.ret !== 200) {
			//this.m_logger.error(`send tx failed ret `, cr.ret);
			return { err: core_1.ErrorCode.RESULT_FAILED };
		}
		return { err: JSON.parse(cr.resp) };
	}
=======
    async sendSignedTransaction(params) {
        let vTx = new core_1.ValueTransaction();
        let err = vTx.decode(new core_1.BufferReader(params.tx));
        if (err) {
            this.m_logger.error(`decode transaction error`, params.tx);
            return { err: core_1.ErrorCode.RESULT_INVALID_FORMAT };
        }
        let cr = await this.m_client.callAsync('sendTransaction', { tx: params.tx });
        if (cr.ret !== 200) {
            this.m_logger.error(`send tx failed ret `, cr.ret);
            return { err: core_1.ErrorCode.RESULT_FAILED, hash: vTx.hash };
        }
        return { err: JSON.parse(cr.resp), hash: vTx.hash };
    }
>>>>>>> 4df2a749eddb2c8a1de23e18927bf833486da732
    async view(params) {
        let cr = await this.m_client.callAsync('view', params);
        if (cr.ret !== 200) {
            return { err: core_1.ErrorCode.RESULT_FAILED };
        }
        return core_1.fromStringifiable(JSON.parse(cr.resp));
    }
}
exports.HostClient = HostClient;
