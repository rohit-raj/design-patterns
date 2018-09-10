let ObserverFunction = function(){
    let observerList = [];

    return {
        subscribeObserver : function(observer){
            observerList.push(observer);
        },

        unsubscribeObserver : function(observer) {
            let index = observerList.indexOf(observer);
            if(index > -1){
                observerList.splice(index, 1);
            }
        },

        notifyObserver : function(observer){
            let index = observerList.indexOf(observer);
            if(index > -1){
                observerList[index].notify(index);
            }

        },

        notifyAllObserver : function(){
            for(let i = 0; i < observerList.length; i++) {
                observerList[i].notify(i);
            }
        }
    };
};

let Observer = function(){
    return {
        notify : function(index) {
            console.log("Observer " + index + " is notified!");
        }
    };
};

var subject = new ObserverFunction();

var observer1 = new Observer();
var observer2 = new Observer();

subject.subscribeObserver(observer1);
subject.subscribeObserver(observer2);

subject.notifyObserver(observer2);

subject.notifyAllObserver();