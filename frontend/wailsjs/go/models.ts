export namespace keyboard {
	
	export class KeyboardType {
	    id: number;
	    key: string;
	    slot: string;
	
	    static createFrom(source: any = {}) {
	        return new KeyboardType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.key = source["key"];
	        this.slot = source["slot"];
	    }
	}

}

