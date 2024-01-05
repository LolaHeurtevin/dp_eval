//Classe contenent l'adresse d'expédition
class Address {
    constructor(name, number, street, city, zipCode)
    {
        this.name = name
        this.number = number
        this.street = street
        this.city = city
        this.zipCode = zipCode
    }
}

//Classe contenant les éléments de la commande
class Order {
    constructor(id, article, phoneNumber, address, email) 
    {
        this.id = id
        this.article = article
        this.phoneNumber = phoneNumber
        this.adress = address
        this.email = email
    }
    
}

//Classe du builder, permet de créer, construire en fonction des éléments choisis et retourner une commande
class OrderBuilder {
    constructor(id, article, address)
    {
        this.order = new Order(id, article, address)
    }
    
    setPhoneNumber (phoneNumber) {
        this.order.phoneNumber = phoneNumber
        return this
    }

    setEmail (email) {
        this.order.email = email
        return this
    }
    
    build() {
        return this.order
    }
}

let orderAddress = new Address ("Serlock Holmes", "221b", "Baker street", "London", "NW1 6XE")
let order = new OrderBuilder('1', 'violin', orderAddress).setPhoneNumber('0111111111').build()
console.log(order)
