import web3 from './web3';
import { ADDRESS, ABI } from '../config/config';

const game = new web3.eth.Contract(ABI, ADDRESS)

export default game;