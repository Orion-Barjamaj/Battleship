export default class Ship{
    constructor(length){
        this.length = length;
        this.color = '#A9A9A9';
        this.hits = 0;
        this.sunk = false;
        this.pos = [];
    }

    hit(){
        this.hits++;
        if(this.hits <= this.length){
            this.sunk = true;
        }
    }
}