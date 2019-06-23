class Owner{
    constructor(id){
        this.id = id;
        this.nickname = "Person " + id;
        this.subtotal = 0; //food items only
        this.claimedItems = [];
        this.total = 0; //includes tax and tip
    }

    resetTotal(){
        this.total = 0;
    }

    resetClaimedItems(){
        this.claimedItems = [];
    }
}