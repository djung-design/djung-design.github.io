class Owner{
    constructor(id){
        this.id = id;
        this.nickname = "Person " + id;
        this.subtotal = 0; //food items only
        this.claimedItems = []; //food items only 
        this.allocTip = 0; //allocated tip
        this.allocTax = 0; //alocated tax
        this.proportion  = 0; //owner's portion of the subtotal relative to everyone
    }

    resetTotal(){
        this.subtotal = 0;
        this.allocTax = 0;
        this.allocTax = 0;
    }

    resetClaimedItems(){
        this.claimedItems = [];
    }
}