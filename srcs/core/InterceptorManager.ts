



export default class InterceptorManager{


    handlers : Array<any>;
    use(fulfilled : () => void, rejected:() => Promise<{}>) : number {
        this.handlers.push({
            fulfilled , 
            rejected
        });
        return this.handlers.length - 1;
    }

    eject(id : number) : void {
        if( this.handlers[id] ){
            this.handlers[id] = null;
        }
    }

    forEach( fn : ( e :any) => void  ) : void {
        this.handlers.forEach((e :any) : void =>{
            if(e !== null ){
                fn(e)
            }
        })
    }
}