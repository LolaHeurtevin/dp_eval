# Évaluation Design Pattern

## Table des matières 

- [Réponses aux questions](#réponses-aux-questions)
- [Design Pattern Builder](#design-pattern-builder)
  - [Contexte](#contexte)
  - [Avantages/Inconvénients](#avantages-et-inconvénients)
  - [Diagramme de classe UML du pattern](#diagramme-de-classe-uml-du-pattern)
  - [Lancer le projet](#lancer-le-projet)
- [Références](#références)


## Réponses aux questions

1. Une interface désigne l'ensemble des signatures des méthodes d'un objet, une méthode qui ne possède qu'une signature n'est pas implémentée. À l'inverse, une méthode implémentée est une méthode dont la procédure est écrite. Il est ainsi plus avantageux de programmer vers une interface puisque cela permet une plus grande flexibilité dans le code. En programmant vers une interface, il est possible d'envoyer le même message aux objets que le client manipule tout en obtenant un comportement différent (à l'aide de différentes implémentations).

![Diagramme présentant l'avantage d'une interface](/images/diagramme-implementation-interface.png "Diagramme présentant l'avantage d'une interface")

Reprenons l'exemple fait en cours, avec les classes de canards. Colvert et RubberDuck sont tous deux des canards qui héritent de la classe Duck, ils nagent tous les deux, cependant ils ne produisent pas le même son, par conséquent il n'est pas judicieux d'implémenter la fonction gossiping() dans la classe Duck, car cela nécessiterai de devoir réécrire par dessus la fonction chaque fois qu'un canard ne fais pas "coin coin". À la place, on créer une interface Gossiping qui sera implémentée dans le classe CoinCoin.

~~~
 abstract class Duck 
 {
    //Tous les canards nagent, donc swim() peut être impélmentée directement dans Duck
    public function swim(){
        echo "[Swimming]" . PHP_EOL ;
    }

    private Gossiping $gossipBehavior;

    public function __construct(
    Gossiping $gossipBehavior){
        $this->gossipBehavior = $gossipBehavior;
    }

    public function gossip(){
        $this->gossipBehavior->gossip();
    }
}

interface Gossiping{
    public function gossip();
}

//ici on créer une classe par comportement sonore. Ainsi, si on devait ajouter un nouveau canard qui produit un son différent,
//tout le code ne serait pas à revoir puisqu'il suffirait d'ajouter une nouvelle classe qui implémente Gossiping
class CoinCoin implements Gossiping {
    public function gossip() {
        echo "Coin coin";
    }
}

class CouicCouic implements Gossiping {
    public function gossip() {
        echo "Couic couic";
    }
}
~~~



2. La composition est le fait d'avoir une instance de classe dans une autre classe *(a un)*, alors que l'héritage est le fait de baser la définition d'une classe sur une autre classe *(est un)*. Dans le cas de l'héritage, la classe enfant récupérera tout le contenu de la classe parent. Il faut préférer la composition à l'héritage car la composition est beaucoup plus flexible, et permet de modifier les comportements lors de l'exécution, alors que l'héritage ne permet de le faire qu'à la compilation. De plus, l'héritage fait hériter d'une interface mais également de son implémentation, ce qui brise le principe d'encapsulation (le fait que l'état d'un objet soit invisible depuis l'extérieur), alors que le principe d'encapsulation est préservé avec la composition car un objet composé d'un autre objet n'a besoin de connaître que son interface pour s'en servir.
Enfin, la composition permet d'éviter le problème du diamant, qui peut survenir dans le cas d'héritages multiples.

Prenons un exemple pour illustrer cela. Voici une classe Animal, et une classe Dog, qui est composée de Animal. Grace à la composition, le code est plus flexible, encapsulé, moins couplé et plus facile à modifier.

~~~
class Animal {
    constructor(name) {
      this.name = name
    }
  
    sound() {
      console.log(`${this.name} fait un bruit.`)
    }
  }
  
  class Dog {
  //Le couplage entre Dog et Animal est réduit car Dog ne dépend que de l'interface publique de Animal et pas de son implémentation.
  
  //Les détails internes de Animal sont encapsulés à l'intérieur de la classe. La classe Dog utilise Animal sans avoir
  //à se soucier de la façon dont Animal est implémenté. Le principe d'encapsulation est donc respecté.
    constructor(name) {
      this.animal = new Animal(name)
    }
  
    bark() {
      console.log(`${this.animal.name} aboie.`)
    }
  
  //Utilise une méthode de la classe Animal
    sound() {
      this.animal.sound()
      
  //Il est possible d'ajouter un comportement spécifique à Dog sans affecter la classe Animal
      console.log(`${this.animal.name} dit 'Woof Woof!'`)
    }
  
    //Comportement spécifique à Dog
    changeName(newName) {
      this.animal.name = newName
    }
  }
  
  const myDog = new Dog('Finn')
  myDog.sound()
  myDog.changeName('Jake')
  myDog.bark() 
~~~



3. Une interface désigne l'ensemble des signatures de méthode d'un objet. L'interface est synonyme de type de l'objet. N'importe quel message qui correspond à une signature de l'interface peut être envoyé à cet objet. De plus, deux objets peuvent posséder une implémentationn différents pour la même interface, ce qui signifient qu'ils agissent différement. 


## Design pattern Builder

### Contexte

Le design pattern builder permet de construire des objets complexes étape par étape, et de rendre le code plus lisible.
Le design builder est très utile lorsqu'on souhaite créer des objets qui possèdent plusieurs éléments internes liés les uns aux autres ou de plusieurs éléments requis et optionnels, car il permet de produire différentes variations d'un objet en utilisant le même code.

Pour ce projet, j'ai choisi de prendre l'exemple d'une commande passée auprès d'une boutique. Une commande est composée de plusieurs attributs, dont certains sont obligatoires (identifiant, adresse, article) et certains sont facultatifs (numéro de téléphone, adresse email). Le problème est que travailler avec des champs facultatifs rend plus confuse la création d'un objet. Par exemple, dans le cas de la création de commande on peut se retrouver avec une création d'objet qui ressemble à *order(id, article, undefined, address, undefined)*. Dans ce cas, le code moins lisible car à première vue on ne sait pas à quels attributs correspondent les valeurs undefined. 
Le design pattern builder permet de pallier ce problème.


### Avantages et Inconvénients

L'avantage principal lié à ce pattern est qu'il construit les objets étape par étape, ce qui rend possible de n'appeler que certaines étapes de la construction si on le souhaite (ce qui est utile pour les champs optionnels comme *phoneNumber* et *email*). Il est également possible de déléguer les étapes ou de les exécuter de manière récursive. 
Le code est ainsi réutilisable pour créer différentes représentations des objets.
Enfin, ce design pattern respecte le principe de responsabilité unique, ce qui signifie que chaque classe ou fonction n'a qu'une seule tâche. Par exemple, les fonctions *setPhoneNumber()* et *setEmail()* ne s'occupent respectivement que d'attribuer une valeur au champ *phoneNumber* ou *email*.

L'inconvénient de ce pattern, est que le builder nécessite de créer beaucoup de nouvelles classes (une seule dans le cas de l'exemple que j'ai choisi d'illustrer, car il est très simple), ce qui accroit la complexité générale du code.


### Diagramme de classe UML du pattern

![Diagramme de classe du Builder](/images/order-diagramme-uml.png "Diagramme de classe du Builder")

La classe Address et la classe Order ont une relation d'aggrégation, et la classe Order et la classe OrderBuilder une relation de composition.
La classe OrderBuilder est représentée en violet car elle participe au design pattern.


### Lancer le projet

Le projet est codé en Javascript, je recommande donc l'installation de [Node.js](https://nodejs.org/en/download/current)
Pour lancer le projet, il suffit de cloner le dépot sur votre ordinateur.

Pour cela, effectuez la commande 

~~~
git clone https://github.com/LolaHeurtevin/dp_eval.git
~~~

Une fois cela fait, effectuer la commande

~~~
cd dp_eval
node builder.js
~~~

Cela lancera le projet tel quel, il est cependant possible de choisir les éléments de l'objet qui s'affichent en modifiant directement le code dans le fichier builder.js. Par défaut il affiche l'identifiant de la commande, l'article commandé, l'adresse et le numéro de téléphone, il est possible de changer la valeur du numéro de téléphone pour *undefined* et/ou de donner une valeur au champ email.


## Références

- Les cours de Design Pattern de Paul Schumacher
- [Le catalogue des patrons de conception de Refactoring.guru](https://refactoring.guru/fr/design-patterns/catalog)
- [5 concepts fondamentaux de la POO](https://itexpert.fr/blog/concepts-fondamentaux-poo/#composition)
- [Vidéo de présentation de design patterns](https://youtu.be/tv-_1er1mWI)
- [Vidéo de présentation d'un Builder](https://www.youtube.com/watch?v=M7Xi1yO_s8E)
- [Cours d'UML en ligne](https://laurent-audibert.developpez.com/Cours-UML/?page=diagramme-classes#L3-3-8)

