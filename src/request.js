






import Request from './class';
import * as util  from './util';
import defaults from './defaults';


function createInstance(config) {
    let context = new Request(config);
    let instance = util.bind( Request.prototype.request , context );
    util.extend( instance , Request.prototype , context );
    util.extend( instance , context );
    return instance;
}

let request = createInstance(defaults);


export default request; 


