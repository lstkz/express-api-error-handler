import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();
